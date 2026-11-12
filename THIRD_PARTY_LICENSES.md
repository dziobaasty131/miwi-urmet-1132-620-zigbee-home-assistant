# Licencje i kod zewnętrzny

## ZigbeeTLc (pvvx)

Projekt domofonu wykorzystuje zmodyfikowany firmware [pvvx/ZigbeeTLc](https://github.com/pvvx/ZigbeeTLc), oparty na commicie [`c915b52`](https://github.com/pvvx/ZigbeeTLc/commit/c915b52).

- Pliki w `firmware/patches/` oraz `firmware/domofon-vs-upstream-c915b52.diff` zawierają zmiany nakładane na kod ZigbeeTLc.
- Pliki `firmware/bin/*.bin` i `firmware/bin/*.zigbee` są skompilowanymi obrazami zawierającymi kod ZigbeeTLc oraz modyfikacje dla domofonu.
- Oryginalny kod ZigbeeTLc pozostaje objęty licencją autora projektu źródłowego. Nie należy przypisywać jego autorstwa właścicielowi tego repozytorium.

Oryginalny plik `LICENSE` z ZigbeeTLc, z wersji `c915b52`, ma następującą treść (zachowaną bez zmian):

```text
Permission is hereby granted, free of charge, to any person obtaining 
a copy of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation the 
rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

Źródło: [ZigbeeTLc / LICENSE @ c915b52](https://github.com/pvvx/ZigbeeTLc/blob/c915b52/LICENSE).

**Uwaga:** tekst licencji ZigbeeTLc jest liberalny i podobny do MIT, ale nie jest identyczny ze standardowym tekstem MIT. GitHub może klasyfikować ją jako „Other”.

## Własny wkład do projektu domofonu

Własne modyfikacje firmware, konfiguracje integracji oraz oryginalna dokumentacja opracowane na potrzeby tego repozytorium są udostępniane na warunkach [MIT](LICENSE), w zakresie, w jakim autor tego repozytorium ma do nich prawa.

Licencja MIT tego repozytorium **nie zastępuje** licencji ZigbeeTLc ani licencji ewentualnych innych komponentów zewnętrznych, które mogą wchodzić w skład kompilowanego firmware.

Dziękujemy autorowi ZigbeeTLc za udostępnienie kodu źródłowego i narzędzi.
