export interface PoyaDayInfo {
  year: number;
  month: number; // 1 - 12
  day: number;
  name: string;
  poyaMonth: string;
  significance: string;
}

export const POYA_DAYS_DATA: PoyaDayInfo[] = [
  // 2025
  { year: 2025, month: 1, day: 13, name: "දුරුතු පුර පසළොස්වක පෝය", poyaMonth: "දුරුතු", significance: "බුදුරජාණන් වහන්සේගේ ප්‍රථම ලංකාගමනය (මහියංගණය)." },
  { year: 2025, month: 2, day: 12, name: "නවම් පුර පසළොස්වක පෝය", poyaMonth: "නවම්", significance: "සැරියුත් මුගලන් අග්‍රශ්‍රාවක තනතුරු පිරිනැමීම හා ආයු සංස්කාරය අත්හැරීම." },
  { year: 2025, month: 3, day: 13, name: "මැදින් පුර පසළොස්වක පෝය", poyaMonth: "මැදින්", significance: "බුදුරජාණන් වහන්සේ කිඹුල්වත්පුරයට වැඩමවීම." },
  { year: 2025, month: 4, day: 12, name: "බක් පුර පසළොස්වක පෝය", poyaMonth: "බක්", significance: "බුදුරදුන්ගේ දෙවන ලංකාගමනය (නාගදීපය)." },
  { year: 2025, month: 5, day: 12, name: "වෙසක් පුර පසළොස්වක පෝය", poyaMonth: "වෙසක්", significance: "සම්බුද්ධ තෙමඟුල (ඉපදීම, බුදුවීම, පිරිනිවීම)." },
  { year: 2025, month: 6, day: 10, name: "පොසොන් පුර පසළොස්වක පෝය", poyaMonth: "පොසොන්", significance: "මිහිඳු මහ රහතන් වහන්සේ ලක්දිවට බුදුදහම වැඩමවීම." },
  { year: 2025, month: 7, day: 10, name: "ඇසළ පුර පසළොස්වක පෝය", poyaMonth: "ඇසළ", significance: "ප්‍රථම ධර්ම දේශනාව (දම්සක් පැවතුම් සූත්‍රය) හා වස් එළඹීම." },
  { year: 2025, month: 8, day: 9, name: "නිකිණි පුර පසළොස්වක පෝය", poyaMonth: "නිකිණි", significance: "ප්‍රථම ධර්ම සංගායනාව හා පසුවස් එළඹීම." },
  { year: 2025, month: 9, day: 7, name: "බිනර පුර පසළොස්වක පෝය", poyaMonth: "බිනර", significance: "මෙහෙණි සසුන (භික්ෂුණී ශාසනය) ආරම්භවීම." },
  { year: 2025, month: 10, day: 6, name: "වප් පුර පසළොස්වක පෝය", poyaMonth: "වප්", significance: "වස් පවාරණය හා කඨින චීවර මාසය ආරම්භවීම." },
  { year: 2025, month: 11, day: 5, name: "ඉල් පුර පසළොස්වක පෝය", poyaMonth: "ඉල්", significance: "පස්වග මහ රහතන් වහන්සේලා ධර්ම ප්‍රචාරයට පිටත්කිරීම හා මෛත්‍රී බෝසතුන් නියත විවරණ ලැබීම." },
  { year: 2025, month: 12, day: 4, name: "උඳුවප් පුර පසළොස්වක පෝය", poyaMonth: "උඳුවප්", significance: "සංඝමිත්තා මහරහත් තෙරණිය ජය ශ්‍රී මහා බෝධි දක්ෂිණ ශාඛාව වැඩමවීම." },

  // 2026
  { year: 2026, month: 1, day: 3, name: "දුරුතු පුර පසළොස්වක පෝය", poyaMonth: "දුරුතු", significance: "බුදුරජාණන් වහන්සේගේ ප්‍රථම ලංකාගමනය සිහිකිරීම." },
  { year: 2026, month: 2, day: 1, name: "නවම් පුර පසළොස්වක පෝය", poyaMonth: "නවම්", significance: "ප්‍රථම මහා සංඝ සන්නිපාතය හා ඕවාද ප්‍රාතිමෝක්ෂය දේශනා කිරීම." },
  { year: 2026, month: 3, day: 23, name: "මැදින් පුර පසළොස්වක පෝය", poyaMonth: "මැදින්", significance: "බුදුරජාණන් වහන්සේ කිඹුල්වත්පුරයට වැඩමවීම සිහිකෙරෙන පින්බර පෝය." },
  { year: 2026, month: 4, day: 21, name: "බක් පුර පසළොස්වක පෝය", poyaMonth: "බක්", significance: "සම්බුදුරදුන්ගේ දෙවන ලංකාගමනය (චූලෝදර මහෝදර යුද්ධය සංසිඳවීම)." },
  { year: 2026, month: 5, day: 20, name: "වෙසක් පුර පසළොස්වක පෝය", poyaMonth: "වෙසක්", significance: "සම්බුද්ධ තෙමඟුල් මහා පින්කම හා ආලෝක පූජාව." },
  { year: 2026, month: 6, day: 19, name: "පොසොන් පුර පසළොස්වක පෝය", poyaMonth: "පොසොන්", significance: "මිහිඳු මහරහතන් වහන්සේගේ ලංකාගමනය හා ශ්‍රී ලංකාද්වීපයට සම්බුදු සසුන පිහිටුවීම." },
  { year: 2026, month: 7, day: 18, name: "ඇසළ පුර පසළොස්වක පෝය", poyaMonth: "ඇසළ", significance: "දම්සක් පැවතුම් සූත්‍ර දේශනාව හා මහා සංඝරත්නයේ වස්සාන සමය ඇරඹීම." },
  { year: 2026, month: 8, day: 17, name: "නිකිණි පුර පසළොස්වක පෝය", poyaMonth: "නිකිණි", significance: "ප්‍රථම ධර්ම සංගායනාව හා ආනන්ද හිමියන් රහත්භාවයට පත්වීම." },
  { year: 2026, month: 9, day: 15, name: "බිනර පුර පසළොස්වක පෝය", poyaMonth: "බිනර", significance: "ප්‍රජාපතී ගෝතමී දේවිය ඇතුළු කුල කාන්තාවන් පැවිදි වී මෙහෙණි සසුන ඇරඹීම." },
  { year: 2026, month: 10, day: 15, name: "වප් පුර පසළොස්වක පෝය", poyaMonth: "වප්", significance: "වස් පවාරණය හා මහා කඨින චීවර පූජා මහෝත්සවය." },
  { year: 2026, month: 11, day: 13, name: "ඉල් පුර පසළොස්වක පෝය", poyaMonth: "ඉල්", significance: "පස්වග තවුසන් ඇතුළු සැටනමක් රහතන් වහන්සේලා ධර්ම ප්‍රචාරයට පිටත්කළ පෝය." },
  { year: 2026, month: 12, day: 13, name: "උඳුවප් පුර පසළොස්වක පෝය", poyaMonth: "උඳුවප්", significance: "සංඝමිත්තා මහරහත් තෙරණිය ශ්‍රී මහා බෝධි අංකුරය රැගෙන වැඩමකළ පෝය." },

  // 2027
  { year: 2027, month: 1, day: 22, name: "දුරුතු පුර පසළොස්වක පෝය", poyaMonth: "දුරුතු", significance: "බුදුරජාණන් වහන්සේගේ ප්‍රථම ලංකාගමනය." },
  { year: 2027, month: 2, day: 20, name: "නවම් පුර පසළොස්වක පෝය", poyaMonth: "නවම්", significance: "ප්‍රථම මහා සංඝ සන්නිපාතය." },
  { year: 2027, month: 3, day: 22, name: "මැදින් පුර පසළොස්වක පෝය", poyaMonth: "මැදින්", significance: "බුදුරජාණන් වහන්සේ කිඹුල්වත්පුරයට වැඩමවීම." },
  { year: 2027, month: 4, day: 20, name: "බක් පුර පසළොස්වක පෝය", poyaMonth: "බක්", significance: "සම්බුදුරදුන්ගේ දෙවන ලංකාගමනය." },
  { year: 2027, month: 5, day: 20, name: "වෙසක් පුර පසළොස්වක පෝය", poyaMonth: "වෙසක්", significance: "සම්බුද්ධ තෙමඟුල් මහා පින්කම." },
  { year: 2027, month: 6, day: 18, name: "පොසොන් පුර පසළොස්වක පෝය", poyaMonth: "පොසොන්", significance: "මිහිඳු මහ රහතන් වහන්සේගේ ලංකාගමනය." },
  { year: 2027, month: 7, day: 18, name: "ඇසළ පුර පසළොස්වක පෝය", poyaMonth: "ඇසළ", significance: "දම්සක් පැවතුම් සූත්‍ර දේශනාව හා වස් එළඹීම." },
];

export const SINHALA_MONTHS = [
  "ජනවාරි",
  "පෙබරවාරි",
  "මාර්තු",
  "අප්‍රේල්",
  "මැයි",
  "ජූනි",
  "ජූලි",
  "අගෝස්තු",
  "සැප්තැම්බර්",
  "ඔක්තෝබර්",
  "නොවැම්බර්",
  "දෙසැම්බර්",
];

export const SINHALA_POYA_NAMES = [
  "දුරුතු",
  "නවම්",
  "මැදින්",
  "බක්",
  "වෙසක්",
  "පොසොන්",
  "ඇසළ",
  "නිකිණි",
  "බිනර",
  "වප්",
  "ඉල්",
  "උඳුවප්",
];

export const SINHALA_WEEKDAYS = [
  { short: "ඉරි", full: "ඉරිදා", en: "Sun" },
  { short: "සඳු", full: "සඳුදා", en: "Mon" },
  { short: "අඟ", full: "අඟහරුවාදා", en: "Tue" },
  { short: "බදා", full: "බදාදා", en: "Wed" },
  { short: "බ්‍රහ", full: "බ්‍රහස්පතින්දා", en: "Thu" },
  { short: "සිකු", full: "සිකුරාදා", en: "Fri" },
  { short: "සෙන", full: "සෙනසුරාදා", en: "Sat" },
];

export function getPoyaForDate(year: number, month: number, day: number): PoyaDayInfo | undefined {
  return POYA_DAYS_DATA.find(
    (p) => p.year === year && p.month === month && p.day === day
  );
}

export function getNextPoyaFromDate(fromDate: Date): PoyaDayInfo | undefined {
  const targetYear = fromDate.getFullYear();
  const targetMonth = fromDate.getMonth() + 1;
  const targetDay = fromDate.getDate();

  return POYA_DAYS_DATA.find((p) => {
    if (p.year > targetYear) return true;
    if (p.year === targetYear && p.month > targetMonth) return true;
    if (p.year === targetYear && p.month === targetMonth && p.day >= targetDay) return true;
    return false;
  }) || POYA_DAYS_DATA[0];
}

export function getBuddhistEraYear(gregorianYear: number, month: number): number {
  // In Sri Lanka, BE usually transitions around Vesak (May)
  return month >= 5 ? gregorianYear + 544 : gregorianYear + 543;
}
