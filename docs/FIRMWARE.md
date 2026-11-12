# Wgrywanie firmware do Xiaomi LYWSD03MMC — krok po kroku

Ta instrukcja jest dla osoby, która ma termometr Xiaomi LYWSD03MMC i chce zmienić go w sterownik domofonu **Miwi-Urmet 1132/620**. Nie trzeba samodzielnie kompilować kodu: gotowe pliki są w katalogu [firmware/bin](../firmware/bin).

**Najważniejsze:** są dwa różne sposoby wgrywania. Wybierz jeden zgodnie z obecnym oprogramowaniem termometru.

| Co jest teraz w termometrze? | Co zrobić? | Lutowanie? |
|---|---|---|
| Fabryczny firmware Xiaomi z działającym Bluetooth | Najpierw sprawdź metodę przez Bluetooth (część A) | Zwykle nie |
| Zwykły ZigbeeTLc | Wgraj nasz plik `.zigbee` przez Zigbee2MQTT (część B) | Nie |
| Brak Bluetooth, problem z aktualizacją lub świadomie wybierasz programator | Programowanie przez pad **SWS** (część C) | Tak |

> [!IMPORTANT]
> **USB–UART nie podłącza się tutaj tak jak do ESP32.** Procesor Telink korzysta z jednoprzewodowego interfejsu programowania **SWS / SWire**. Odpowiedni program potrafi wykorzystać adapter USB–UART do emulacji SWire. Nie łącz zwykłego RX z TX termometru ani nie podawaj 5 V na płytkę.

## Zanim zaczniesz

1. Sprawdź model **LYWSD03MMC** i rewizję płytki. Projekt był testowany na **HW B1.4**; dla B1.5/B1.6 i innych rewizji śledź szczególne instrukcje autora firmware.
2. Przygotuj **nową baterię CR2032**. Aktualizacja OTA potrafi pobierać znacznie więcej energii niż normalna praca.
3. Pobierz z tego repozytorium:
   - [`Z03MMC_domofon.bin`](../firmware/bin/Z03MMC_domofon.bin) — **do programowania przewodowego przez SWS**.
   - [`1141-020a-20043001-Z03MMC.zigbee`](../firmware/bin/1141-020a-20043001-Z03MMC.zigbee) — **do aktualizacji Zigbee OTA**.
4. Zadbaj o dostęp do Zigbee2MQTT i możliwość parowania nowych urządzeń.

**Nie zamieniaj tych plików:** obrazy `.bin` i `.zigbee` służą innym etapom aktualizacji.

## A. Fabryczny termometr Xiaomi: zacznij bez lutowania

Wiele egzemplarzy można przeprowadzić z fabrycznego BLE do Zigbee **przez Bluetooth**, a później wgrać firmware domofonu przez Zigbee. Jest to dwuetapowy proces; nie próbuj wgrywać naszego pliku `Z03MMC_domofon.bin` bezpośrednio jako zwykłej aktualizacji fabrycznego oprogramowania.

1. Na komputerze/telefonie z obsługą Web Bluetooth otwórz oficjalny [TelinkMiFlasher pvvx](https://pvvx.github.io/ATC_MiThermometer/TelinkMiFlasher.html). Korzystaj z **Chrome, Edge lub Opera**; nie z Safari.
2. Kliknij **Connect** i wybierz termometr `LYWSD03MMC`. Jeśli jest na fabrycznym firmware, wykonaj **Do Activation**, zgodnie z komunikatami narzędzia.
3. Zainstaluj obsługiwany **pośredni firmware BLE (ATC/pvvx)** oferowany przez narzędzie. Następnie rozłącz i połącz się ponownie z termometrem (może zmienić nazwę na `ATC_...`).
4. Z poziomu TelinkMiFlasher przeprowadź konwersję **BLE → ZigbeeTLc** zgodnie z [instrukcją ZigbeeTLc](https://github.com/pvvx/ZigbeeTLc#to-flash-the-zigbee-from-ble-firmware-use-a-google-chrome-microsoft-edge-or-opera-browser). Użyj obrazu i ścieżki zalecanej przez autora dla swojej rewizji, **nie przypadkowego pliku Zigbee innego projektu**.
5. Włącz parowanie w Zigbee2MQTT. Po przejściu termometru na Zigbee sprawdź, czy pojawił się w sieci.
6. Teraz przejdź do **części B** i zainstaluj naszą modyfikację domofonu.

**Uwaga dla nowych firmware Xiaomi:** wersje od `2.1.1_0159` mogą wymagać rejestracji w Mi Home i pozyskania danych aktywacyjnych (Device ID, token, bind key), a procedura zależy też od rewizji płytki. Nie omijaj tego na siłę — zajrzyj do [opisu pvvx](https://github.com/pvvx/ATC_MiThermometer/issues/602). Na macOS przejście z BLE do Zigbee może być ograniczone przez obsługę Bluetooth; w takim przypadku skorzystaj z Windows/Linux/Android lub metody przewodowej.

## B. Masz już ZigbeeTLc: wgraj firmware domofonu przez Zigbee2MQTT

Nie potrzebujesz lutownicy ani adaptera. Użyj lokalnej aktualizacji OTA:

1. Pobierz **`1141-020a-20043001-Z03MMC.zigbee`** oraz [`homeassistant/zigbee2mqtt/index.json`](../homeassistant/zigbee2mqtt/index.json).
2. W katalogu danych Zigbee2MQTT (tym z `configuration.yaml`) utwórz `ota_domofon`. Umieść w nim **oba pliki**. Zweryfikuj, że ścieżka do firmware w `index.json` odpowiada faktycznemu położeniu pliku.
3. W `configuration.yaml` Zigbee2MQTT dodaj (lub uzupełnij istniejącą sekcję `ota`):

   ```yaml
   ota:
     zigbee_ota_override_index_location: ota_domofon/index.json
   ```

4. Zrestartuj Zigbee2MQTT. Otwórz urządzenie w panelu, przejdź do **OTA** i sprawdź dostępność aktualizacji.
5. Uruchom aktualizację. W testach tego projektu zajmowała około **25 minut**. **Nie wyjmuj baterii podczas aktualizacji.**
6. Po ukończeniu sprawdź identyfikację urządzenia jako `DOMOFON-z`, dodaj [konwerter zewnętrzny](../homeassistant/zigbee2mqtt/external_converters/domofon.mjs) i przetestuj stany `occupancy` i `state`.

Jeśli Zigbee2MQTT nie widzi aktualizacji, sprawdź najpierw ścieżkę do pliku, zawartość indeksu, wersję firmware, dostępność urządzenia oraz dziennik Zigbee2MQTT. **Nie wymuszaj obrazu przeznaczonego dla innego modelu.**

Dokumentacja Zigbee2MQTT: [lokalne aktualizacje OTA](https://www.zigbee2mqtt.io/guide/usage/ota_updates.html).

## C. Programowanie przewodowe SWS: gdy Bluetooth nie działa lub wybierasz kabel

Ta metoda wymaga otwarcia obudowy termometru i dostępu do punktów na jego płytce.

### Co przygotować

- Komputer z Pythonem 3 oraz modułem `pyserial`.
- **Adapter USB–UART TTL 3,3 V**, zgodny z emulacją SWire — **nie każdy adapter się nadaje**. Autor narzędzia ostrzega m.in. przed FTDI i adapterami z diodami LED obciążającymi RX.
- Rezystor **1–1,8 kΩ** używany w udokumentowanym układzie połączeń SWS–UART.
- Cienkie przewody, lutownicę i multimetr.
- Narzędzie [pvvx/TlsrComSwireWriter](https://github.com/pvvx/TlsrComSwireWriter), plik `TLSR825xComFlasher.py`.
- Nasz plik **`Z03MMC_domofon.bin`**.

### Połączenia

1. Wyjmij baterię i odszukaj na płytce termometru **P14 (SWS)**, **GND** i punkt zasilania bateryjnego. Skorzystaj z [pinoutów pvvx](https://github.com/pvvx/ATC_MiThermometer/tree/master/BoardPinout), dobierając je do rewizji.
2. Połącz **wspólną masę GND** adaptera i płytki termometru.
3. Przygotuj linię **SWS** zgodnie ze [schematem programatora SWire](https://github.com/devbis/z03mmc/blob/master/assets/Mi_SWS_Connection.jpg) i instrukcją narzędzia, uwzględniając rezystor. **SWS nie jest klasycznym pinem RX.**
4. Do programowania zapewnij płytce **stabilne zasilanie 3,3 V** zgodnie ze schematem i sposobem sterowania resetem używanym przez programator. **Nie łącz równocześnie baterii CR2032 z zewnętrznym 3,3 V** i nigdy nie podawaj 5 V.
5. Sprawdź napięcia i brak zwarć *przed podłączeniem USB*.

Nie zgaduj kolejności wyprowadzeń w swoim adapterze USB–UART. Jego opisy pinów i sposób resetowania mogą się różnić. Dokładny schemat połączeń z powyższego linku jest obowiązkowy; samo dopasowanie nazw `TX/RX` nie wystarcza.

### Wgranie obrazu

W terminalu (przykład dla Linux; na macOS port zwykle ma postać `/dev/cu.usbserial-...`, a na Windows `COM3`):

```bash
python3 -m pip install pyserial
git clone https://github.com/pvvx/TlsrComSwireWriter.git
cd TlsrComSwireWriter
python3 TLSR825xComFlasher.py -p /dev/ttyUSB0 wf 0 /sciezka/do/Z03MMC_domofon.bin
```

Zamień `/dev/ttyUSB0` i ścieżkę pliku na właściwe. Opcja `wf 0` zapisuje obraz od początku pamięci flash. Programator może wymagać sekwencji aktywacji/resetu opisanej w jego README; w razie braku komunikacji **nie wykonuj od razu kasowania całej pamięci**.

Po poprawnym zapisie odłącz adapter, usuń tymczasowe przewody programowania, włóż CR2032 i włącz parowanie w Zigbee2MQTT. Do normalnego działania **nie ma żadnego przewodu zasilającego** — sterownik działa wyłącznie na baterii termometru.

### Gdy nie działa

- **Brak połączenia z układem:** sprawdź port, GND, linię SWS, rezystor, zasilanie 3,3 V oraz reset/aktywację.
- **Błąd przy zapisie:** sprawdź zgodność adaptera, stabilność zasilania i zalecenia flashera. Nie używaj przypadkowych wartości napięcia czy sygnałów.
- **Nie pojawia się w Zigbee2MQTT:** włącz parowanie, uruchom urządzenie ponownie i sprawdź logi.
- **Niewłaściwy obraz:** potwierdź, że programujesz LYWSD03MMC **HW B1.4** i używasz `Z03MMC_domofon.bin`, a nie pliku OTA.

## Co dalej?

Po poprawnym wgraniu firmware przejdź do [instrukcji montażu w unifonie](MONTAZ.md), a następnie do [konfiguracji Home Assistant](../README.md#integracja-z-home-assistant).

### Źródła techniczne

- [pvvx/ZigbeeTLc](https://github.com/pvvx/ZigbeeTLc)
- [pvvx/ATC_MiThermometer](https://github.com/pvvx/ATC_MiThermometer)
- [pvvx/TlsrComSwireWriter](https://github.com/pvvx/TlsrComSwireWriter)
- [devbis/z03mmc — programowanie SWS](https://github.com/devbis/z03mmc)
- [Zigbee2MQTT — OTA](https://www.zigbee2mqtt.io/guide/usage/ota_updates.html)

> **Status:** opis połączeń i narzędzi został porównany z dokumentacją upstream, ale wariant przewodowy nie był ponownie wykonany i przetestowany podczas redakcji tego poradnika.
