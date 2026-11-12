// Domofon Miwi-Urmet 1132/620 – Xiaomi LYWSD03MMC z firmware ZigbeeTLc (wersja "domofon", pady P8/P9/P7)
// occupancy = dzwonek (P8). state ON = sekwencja otwierania: widełki w górę (P9) → czekanie na odebranie
// → klucz (P7) 4 s → widełki w dół. Urządzenie samo wraca do OFF po zakończeniu.
import * as m from 'zigbee-herdsman-converters/lib/modernExtend';

export default {
    zigbeeModel: ['DOMOFON-z'],
    model: 'DOMOFON-z',
    vendor: 'DIY',
    description: 'Domofon Miwi-Urmet 1132/620 (LYWSD03MMC + ZigbeeTLc)',
    extend: [
        m.occupancy(),
        m.onOff({powerOnBehavior: false}),
        m.battery({voltage: true}),
        m.temperature({reporting: {min: 10, max: 300, change: 10}}), // raport co ≤5 min = sygnał „żyje” dla watchdoga
        m.humidity(),
    ],
    ota: true,
};
