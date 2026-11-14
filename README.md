# Domofon Miwi-Urmet 1132/620 → Zigbee + Home Assistant

**Stary domofon, powiadomienie na telefon i otwieranie drzwi jednym dotknięciem. Bez wymiany unifonu i bez dodatkowego zasilania.** 🔋

Cały sterownik działa na **jednej baterii CR2032**, tej samej, która normalnie zasila termometr **Xiaomi LYWSD03MMC**. Po wgraniu zmodyfikowanego firmware ZigbeeTLc i dołożeniu kilku prostych elementów termometr potrafi wykryć dzwonek, powiadomić Home Assistant i zdalnie uruchomić otwieranie drzwi.

Oryginalna słuchawka oraz przycisk otwierania nadal działają jak wcześniej. Nie trzeba prowadzić przewodu zasilającego ani pobierać zasilania z magistrali budynku.

> [!NOTE]
> Projekt został zbudowany i przetestowany na **Miwi-Urmet 1132/620 (starsza rewizja płytki)** oraz **Xiaomi LYWSD03MMC HW B1.4**. Inne rewizje mogą mieć inne połączenia. **Żywotność CR2032 jest nadal testowana** — nie ma jeszcze wiarygodnego wyniku długoterminowego.

## Zobacz, jak to działa

1. Ktoś dzwoni przy wejściu do budynku.
2. Home Assistant wysyła na telefon powiadomienie **„Ktoś przy klatce”** z akcją **„Otwórz drzwi”**.
3. Po kliknięciu sterownik elektronicznie „podnosi słuchawkę”, czeka na odebranie połączenia przez centralę, naciska przycisk otwierania i „odkłada słuchawkę”.
4. Wszystko odbywa się bez dotykania unifonu. Nadal można korzystać z niego zupełnie normalnie.

![Schemat działania: unifon, termometr Xiaomi, Zigbee2MQTT, Home Assistant i telefon](docs/img/s_blokowy.png)

### Zdjęcia gotowego układu

| Domofon po przeróbce | Dodatkowa płytka sterująca |
|:---:|:---:|
| ![Domofon z zamontowanym sterownikiem Xiaomi i dodatkową elektroniką](docs/img/unifon.jpg) | ![Płytka uniwersalna z elementami układu sterowania](docs/img/plytka.jpg) |

[Zobacz również tylną stronę oryginalnej płytki unifonu z przylutowanymi przewodami](docs/img/unifon_lutowania.jpeg).

## Co wyróżnia ten projekt?

| Funkcja | Jak to działa? |
|---|---|
| 🔋 **Zasilanie bateryjne** | Sterownik korzysta z CR2032 w termometrze — **bez zasilacza, USB i dodatkowego przewodu zasilającego**. |
| 🔔 **Wykrywanie dzwonka** | Sygnał wywołania jest odczytywany z obwodu głośnika słuchawki. |
| 📱 **Powiadomienie na telefonie** | Home Assistant wysyła powiadomienie z przyciskiem otwarcia drzwi. |
| 🔓 **Zdalne otwieranie** | Układ symuluje podniesienie słuchawki i naciśnięcie przycisku w unifonie. |
| 🏠 **Bez utraty oryginalnych funkcji** | Słuchawka i fizyczne przyciski nadal działają. |
| 🛡️ **Zabezpieczenie w Home Assistant** | Przykładowy skrypt dopuszcza otwieranie do 60 s po dzwonku i tylko raz dla jednego wywołania. |
| 📶 **Zigbee2MQTT** | Stan dzwonka, polecenie otwarcia, bateria i diagnostyka są dostępne w Zigbee2MQTT. |

Firmware oszczędza energię m.in. przez wyłączenie wyświetlacza. Po wykryciu dzwonka urządzenie przez około **60 sekund** częściej komunikuje się z koordynatorem, aby polecenie otwarcia mogło dotrzeć szybko.

**Uwaga:** działanie na baterii zostało potwierdzone w praktyce, ale nie oznacza to jeszcze potwierdzonego czasu pracy przez wiele miesięcy.

## Jak zbudować własny egzemplarz?

Nie musisz od razu zagłębiać się w kod źródłowy. Dokumentacja jest podzielona na etapy — można przejść przez nią po kolei.

| Etap | Co zrobić | Instrukcja |
|---|---|---|
| **1. Firmware** | Przygotuj Xiaomi LYWSD03MMC i wgraj oprogramowanie domofonu przez BLE → Zigbee OTA albo przewodowo przez SWS. | **[Wgrywanie firmware krok po kroku](docs/FIRMWARE.md)** |
| **2. Elektronika** | Zmontuj prosty układ z transoptorów, tranzystorów i rezystorów. | **[Montaż i schematy połączeń](docs/MONTAZ.md)** |
| **3. Integracja** | Dodaj konwerter Zigbee2MQTT, automatyzacje i skrypt otwierania do Home Assistant. | **[Gotowe pliki Home Assistant](homeassistant/)** |
| **4. Testy** | Zweryfikuj dzwonek, podnoszenie słuchawki, otwieranie i działanie oryginalnego unifonu. | **[Testy i rozwiązywanie problemów](docs/MONTAZ.md#9-jeśli-coś-nie-działa)** |

> [!TIP]
> **Masz termometr z fabrycznym firmware?** Zacznij od [instrukcji wgrywania](docs/FIRMWARE.md). W niektórych wersjach można przejść na Zigbee przez Bluetooth bez lutowania programatora. Jeśli termometr ma już ZigbeeTLc, modyfikację domofonową można wgrać przez OTA. W wariancie przewodowym używany jest interfejs **SWS/SWire**, a nie zwykły UART TX/RX.

### Lista elementów

| Element | Ilość | Rola |
|---|---:|---|
| **Xiaomi LYWSD03MMC** (testowany HW B1.4) | 1 | Bateryjny sterownik Zigbee |
| Transoptor EL817C / PC817 | 2 | Wykrywanie dzwonka i sterowanie widełkami |
| Tranzystor BC547 lub odpowiedni małosygnałowy NPN | 2 | Sterowanie widełkami i przyciskiem otwierania |
| Rezystor 1 kΩ | 1 | Obwód wykrywania dzwonka |
| Rezystor 330 Ω | 2 | Sterowanie transoptorem i tranzystorem |
| Dioda 1N4148 | 1 | Ochrona wejścia wykrywania dzwonka |
| Płytka uniwersalna, przewody | według potrzeb | Montaż układu w obudowie unifonu |

Do montażu potrzebne są też lutownica i multimetr. **Pełne schematy i opis sprawdzonych punktów połączeń** znajdziesz w [instrukcji montażu](docs/MONTAZ.md) oraz [PDF-ie](docs/domofon-miwi-urmet-home-assistant.pdf).

## Połączenia — w skrócie

To jedynie mapa funkcji. **Nie zastępuje schematów elektrycznych ani pomiarów konkretnej płytki.**

| Funkcja | Pad termometru | Miejsce podłączenia w testowanym unifonie |
|---|---|---|
| Wykrywanie dzwonka | **P8 / PA6** | Przewody głośnika słuchawki — przez obwód transoptora |
| „Podniesienie słuchawki” | **P9 / PC4** | Styki **2–4** przełącznika widełek — przez układ transoptora i tranzystora |
| Otwieranie drzwi | **P7 / PD7** | Styki przycisku otwierania — przez tranzystor |
| Masa sterownika | **GND** | Masa unifonu przy blaszce przycisku |
| Programowanie przewodowe | **P14 / SWS** | Pad programowania — pozostaw dostępny |

> [!CAUTION]
> **Nie podłączaj sterownika do zacisków L+ / L− magistrali budynku.** Podczas prób w testowanej instalacji ingerencja w L+ zakłóciła działanie centrali i wywołała błąd panelu wejściowego. To wspólna instalacja, więc błędne podłączenie może dotknąć również sąsiadów. Przed montażem sprawdź styki miernikiem i odłącz unifon od instalacji.

## Firmware i pliki do pobrania

Oprogramowanie powstało jako modyfikacja [pvvx/ZigbeeTLc](https://github.com/pvvx/ZigbeeTLc), oparta na commicie **`c915b52`**. Kod obsługi domofonu dodaje wykrywanie wywołania, sekwencję otwierania, obsługę problemów z przełącznikiem widełkowym i zarządzanie aktywnością urządzenia.

| Plik | Zastosowanie |
|---|---|
| [`Z03MMC_domofon.bin`](firmware/bin/Z03MMC_domofon.bin) | Obraz do programowania przewodowego przez SWS |
| [`1141-020a-20043001-Z03MMC.zigbee`](firmware/bin/1141-020a-20043001-Z03MMC.zigbee) | Obraz aktualizacji OTA dla Zigbee2MQTT |
| [`firmware/patches/`](firmware/patches/) | Pięć patchy Git dla ZigbeeTLc |
| [`firmware/domofon-vs-upstream-c915b52.diff`](firmware/domofon-vs-upstream-c915b52.diff) | Zbiorczy diff względem upstreamu |

**Instrukcja instalacji firmware:** [BLE, Zigbee OTA i programowanie SWS](docs/FIRMWARE.md).

### Jak działa otwieranie?

Sterownik zwiera styki 2–4 („podnosi słuchawkę”), co **100 ms** sprawdza, czy dzwonek ustał, a po wykryciu odebrania uruchamia przycisk otwierania na **4 sekundy**. Następnie zwalnia widełki. Jeśli mechanizm nie zadziała prawidłowo, firmware może ponowić przełączenie widełek (maksymalnie dwie próby).

Czasy i szczegóły sekwencji opisano w [dokumentacji montażu i pomiarów](docs/domofon-miwi-urmet-home-assistant.pdf). Konfiguracja firmware znajduje się m.in. w `src/board_lyws03mmc.h` po nałożeniu patchy.

### Samodzielna kompilacja

Jeśli chcesz coś zmienić w firmware, sklonuj **oba repozytoria obok siebie** i nałóż patche na właściwą wersję ZigbeeTLc:

```bash
git clone https://github.com/dziobaasty131/miwi-urmet-1132-620-zigbee-home-assistant.git
git clone https://github.com/pvvx/ZigbeeTLc.git
cd ZigbeeTLc
git checkout -b domofon c915b52
git am ../miwi-urmet-1132-620-zigbee-home-assistant/firmware/patches/*.patch
make -s -j8 VERSION_BIN=_domofon PROJECT_NAME=Z03MMC \
  POJECT_DEF="-DBOARD=BOARD_LYWSD03MMC -DUSE_DOMOFON=1" \
  ZNAME="DIY:DOMOFON-z" PYTHON=python3 BIN_PATH=./out_domofon
```

Kompilacja wymaga toolchainu Telink opisanego w ZigbeeTLc. **Ten zestaw poleceń nie był ponownie sprawdzany pełną kompilacją podczas redakcji dokumentacji.** Jeśli chcesz tylko uruchomić projekt, skorzystaj z gotowych obrazów firmware.

<details>
<summary>Sumy kontrolne obrazów firmware (SHA-256)</summary>

```text
59ed7929cebf7cf468276326f5630b1118c164847b2ef48809e854a7fa9e4d6e  Z03MMC_domofon.bin
255a72d274bb0a41affa6561dce3be4260f697fce127411b0b5f4e0940920d75  1141-020a-20043001-Z03MMC.zigbee
```

</details>

## Home Assistant i Zigbee2MQTT

Firmware zgłasza się w Zigbee2MQTT jako **`DOMOFON-z`**. W projekcie przygotowano przykładowe pliki do uruchomienia powiadomień i otwierania:

| Plik | Co robi? |
|---|---|
| [Konwerter Zigbee2MQTT](homeassistant/zigbee2mqtt/external_converters/domofon.mjs) | Udostępnia odczyt dzwonka (`occupancy`), sterowanie (`state`), baterię i pomiary |
| [Automatyzacje](homeassistant/automations.yaml) | Wysyłają powiadomienie na telefon z przyciskiem „Otwórz” i alarmują o utracie łączności |
| [Skrypt otwierania](homeassistant/scripts.yaml) | Sprawdza, czy dzwonek wystąpił w ostatnich 60 sekundach i czy przy tym wywołaniu nie otwierano już drzwi |
| [Indeks aktualizacji OTA](homeassistant/zigbee2mqtt/index.json) | Wskazuje lokalny obraz firmware do Zigbee2MQTT |

Przed użyciem **podmień `notify.mobile_app_TWOJ_TELEFON` i zweryfikuj identyfikatory encji** w swoim Home Assistant. Przykładowe automatyzacje zakładają konkretną nazwę urządzenia i temat MQTT.

## Dokumentacja

- 📘 **[Montaż krok po kroku](docs/MONTAZ.md)** — elementy, pomiary, schematy, zdjęcie rzeczywistych lutowań, testy i diagnostyka.
- 💾 **[Wgrywanie firmware](docs/FIRMWARE.md)** — od fabrycznego termometru do wersji domofonowej przez BLE, OTA lub SWS.
- 📄 **[Dokumentacja PDF](docs/domofon-miwi-urmet-home-assistant.pdf)** — schemat blokowy, szczegółowe schematy obwodów i wyniki pomiarów.
- 🧩 **[Pliki Home Assistant](homeassistant/)** — konwerter, automatyzacje, skrypt i indeks OTA.

## Kilka rzeczy, których nauczył mnie ten projekt

- **Sam transoptor nie wystarczył** do symulacji podniesienia słuchawki. Centrala nie zawsze widziała odebranie — pomogło użycie tranzystora.
- **Przycisk otwierania wymaga odpowiednio niskiego spadku napięcia.** Niektóre testowane warianty z transoptorem działały niepewnie.
- **Widełki potrafią się mechanicznie zacinać.** Dlatego firmware przewiduje ponowienie przełączenia.
- **Otwieranie bez wywołania nie było dostępne** w testowanej centrali. Układ najpierw musi zasymulować odebranie połączenia.

Dokładniejsze wskazówki są w [sekcji diagnostycznej instrukcji montażu](docs/MONTAZ.md#9-jeśli-coś-nie-działa).

## Bezpieczeństwo, autorstwo i licencje

To dokumentacja **działającego prototypu**, a nie uniwersalny moduł do dowolnego domofonu. Przeróbkę wykonujesz na własne ryzyko. Nie modyfikuj centrali ani magistrali budynku, a przed lutowaniem zweryfikuj swoją rewizję płytki.

Projekt korzysta z **[ZigbeeTLc autorstwa pvvx](https://github.com/pvvx/ZigbeeTLc)**. Oryginalny kod pozostaje objęty licencją autora; szczegóły i pełny tekst znajdują się w [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md). Własne modyfikacje i oryginalna dokumentacja repozytorium są udostępniane na [MIT](LICENSE), w zakresie praw przysługujących ich autorowi. Gotowe obrazy zawierają zarówno kod ZigbeeTLc, jak i modyfikacje domofonowe.

**Masz pytanie, znalazłeś błąd albo chcesz dostosować projekt do innego modelu?** Zajrzyj do [Issues](../../issues) lub zaproponuj zmianę przez pull request.
