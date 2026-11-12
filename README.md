# Domofon Miwi-Urmet 1132/620 → Zigbee / Home Assistant

Powiadomienie o dzwonku na telefon i otwieranie drzwi na dole jednym kliknięciem, bez podnoszenia słuchawki.
Sterownikiem jest termometr **Xiaomi LYWSD03MMC** z przerobionym firmware Zigbee
([pvvx/ZigbeeTLc](https://github.com/pvvx/ZigbeeTLc)). Do tego kilka części za parę złotych.

📄 Pełny opis ze schematami: [docs/domofon-miwi-urmet-home-assistant.pdf](docs/domofon-miwi-urmet-home-assistant.pdf)

![Schemat blokowy](docs/img/s_blokowy.png)

## Jak to działa

1. Ktoś dzwoni z dołu → termometr wykrywa sygnał dzwonka → Home Assistant wysyła powiadomienie z przyciskiem **„Otwórz”**.
2. Po kliknięciu termometr „podnosi słuchawkę” (zwiera styki 2–4 widełek), czeka, aż unifon przestanie dzwonić
   (połączenie odebrane), wciska przycisk otwierania na 4 s i „odkłada słuchawkę”.
3. Drzwi otwierają się ok. 2–3 s po kliknięciu. Oryginalna słuchawka działa normalnie, a nic nie jest podłączone do magistrali budynku.

| Unifon po przeróbce | Płytka |
|---|---|
| ![Unifon](docs/img/unifon.jpg) | ![Płytka](docs/img/plytka.jpg) |

## Części

| Element | Ilość | Do czego |
|---|---|---|
| Xiaomi LYWSD03MMC (testowany HW B1.4) | 1 | sterownik Zigbee |
| Transoptor EL817C / PC817 | 2 | U1 – dzwonek, U3 – widełki |
| Tranzystor BC547 (dowolny mały NPN) | 2 | wzmocnienie widełek, klucz otwierania |
| Rezystor 1 kΩ | 1 | dzwonek |
| Rezystor 330 Ω | 2 | sterowanie U3 i tranzystora klucza |
| Dioda 1N4148 | 1 | ochrona diody U1 |

## Połączenia

| Funkcja | Termometr | Unifon | Schemat |
|---|---|---|---|
| Dzwonek | P8 (PA6), wejście aktywne niskim | czerwony i zielony przewód głośnika słuchawki | [s_dzwonek.png](docs/img/s_dzwonek.png) |
| Widełki | P9 (PC4) | styki 4 i 2 przełącznika widełek | [s_widelki.png](docs/img/s_widelki.png) |
| Klucz | P7 (PD7) | nit (+) i blaszka (masa) przycisku otwierania | [s_klucz.png](docs/img/s_klucz.png) |

Masa termometru jest połączona z blaszką przycisku (masą unifonu). Pad **P14 (SWS)** zostaw wolny do wgrywania przewodem.

> ⚠️ **Nigdy nic nie podłączaj do L+.** To magistrala danych całego budynku, a nie zasilanie.
> Próba podciągnięcia sygnału z L+ położyła ją (panel na dole pokazał „error”).

## Firmware

Zmiany względem upstreamu: ok. 240 linii w 10 plikach (nowe `src/domofon.c`, `src/domofon.h`,
poprawki w `sensor_pir.c`, `app_main.c`, `zcl_appCb.c`, `board_lyws03mmc.h`, …).

- `firmware/patches/` – seria 5 commitów (`git am`), na bazie upstream **c915b52**
- `firmware/domofon-vs-upstream-c915b52.diff` – to samo jako jeden diff
- `firmware/bin/Z03MMC_domofon.bin` – obraz do wgrania przewodem / przez TelinkMiFlasher
- `firmware/bin/1141-020a-20043001-Z03MMC.zigbee` – obraz OTA dla Zigbee2MQTT (wersja 0x20043001)

SHA-256:
```
59ed7929cebf7cf468276326f5630b1118c164847b2ef48809e854a7fa9e4d6e  Z03MMC_domofon.bin
255a72d274bb0a41affa6561dce3be4260f697fce127411b0b5f4e0940920d75  1141-020a-20043001-Z03MMC.zigbee
```

### Budowanie

```bash
git clone https://github.com/pvvx/ZigbeeTLc.git && cd ZigbeeTLc
git checkout -b domofon c915b52
git am ../firmware/patches/*.patch
make -s -j8 VERSION_BIN=_domofon PROJECT_NAME=Z03MMC \
  POJECT_DEF="-DBOARD=BOARD_LYWSD03MMC -DUSE_DOMOFON=1" \
  ZNAME="DIY:DOMOFON-z" PYTHON=python3 BIN_PATH=./out_domofon
```
(Toolchain Telink – jak w instrukcji ZigbeeTLc.)

### Wgrywanie

- **Termometr już ma ZigbeeTLc:** aktualizacja OTA z Zigbee2MQTT. Wrzuć plik `.zigbee` i `homeassistant/zigbee2mqtt/index.json`
  do katalogu `ota_domofon/` obok konfiguracji Z2M, w `configuration.yaml` Z2M ustaw
  `ota: zigbee_ota_override_index_location: ota_domofon/index.json` i uruchom aktualizację urządzenia (trwa ok. 25 min).
- **Termometr z fabrycznym firmware:** najpierw wgraj ZigbeeTLc według [instrukcji pvvx](https://github.com/pvvx/ZigbeeTLc),
  potem OTA jak wyżej. `Z03MMC_domofon.bin` przyda się przy wgrywaniu przewodem (SWS).

### Sekwencja otwierania

| Krok | Co się dzieje |
|---|---|
| 1 | Widełki w górę (zwarcie 2–4) |
| 2 | Co 100 ms sprawdzanie dzwonka; cisza ≥ 1,2 s (najwcześniej 1 s po podniesieniu) = odebrane |
| 3 | 0,3 s → klucz 4 s → 0,5 s → widełki w dół |
| 4 | Dalej dzwoni po 2,5 s (zacięty przełącznik widełek) → widełki w dół na 0,4 s i znów w górę, maks. 2 razy |
| 5 | Przed kliknięciem w ogóle nie dzwoniło → klucz po 3 s |

Czasy ustawia się w `src/board_lyws03mmc.h` (`DOMOFON_*`). Po dzwonku termometr przez 60 s szybko odpytuje koordynator,
więc komenda „Otwórz” dochodzi od razu. Wyświetlacz jest wyłączony, żeby oszczędzać baterię CR2032.

## Home Assistant

- `homeassistant/zigbee2mqtt/external_converters/domofon.mjs` – konwerter dla Zigbee2MQTT (model `DOMOFON-z`)
- `homeassistant/automations.yaml` – powiadomienie z „Otwórz”, obsługa przycisku, watchdog łączności
- `homeassistant/scripts.yaml` – blokada: otwiera tylko do 60 s po dzwonku i raz na dzwonek

Zamień `notify.mobile_app_TWOJ_TELEFON` na swoją usługę powiadomień.

## Lekcje

- Sam transoptor nie wystarcza ani do widełek, ani do klucza (za mały prąd / za duży spadek napięcia). Tranzystor rozwiązuje problem.
- Przełącznik widełek bywa zawodny mechanicznie – stąd automatyczny „klik” w firmware.
- Otwieranie bez wywołania (funkcja T1, zacisk T2:180) było w tej centrali wyłączone.
- W logach Z2M: jeśli „dzwoni” trwa przez cały czas podniesionych widełek, centrala nie zobaczyła odebrania.

## Zastrzeżenie

Przeróbka na własną odpowiedzialność. Unifon jest częścią instalacji budynku – nie ingeruj w magistralę ani w centralę.
Opis dotyczy Miwi-Urmet 1132/620 ze starszą rewizją płytki; inne modele mogą mieć inne styki i napięcia.

Firmware bazuje na [pvvx/ZigbeeTLc](https://github.com/pvvx/ZigbeeTLc) – podziękowania dla autora.

## Licencja

MIT – patrz [LICENSE](LICENSE). Firmware to zmiany do [pvvx/ZigbeeTLc](https://github.com/pvvx/ZigbeeTLc), na jego licencji.
