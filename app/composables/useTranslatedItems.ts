export function useTranslatedItems<T extends TranslatableItem>(
  item: Ref<T[] | undefined> | T[] | undefined,
  locale: MaybeRef<string> = "fr",
  debug: boolean = false,
): ComputedRef<T[] | undefined> {
  return computed(() => {
    const data = unref(item);
    const lang = unref(locale);
    const languageCode = lang == "en" ? "en-US" : "fr-FR";

    if (!data) return undefined;

    if(debug) console.log(data)

    // Find translation matching locale
    let translatedItems: T[] = [];

    data.forEach((item) => {
      const translation = item.translations?.find(
        (t) => (t as Translatable).languages_code === languageCode,
      ) as T | undefined;
      
      // Merge: translation fields override base fields
      if (translation) {
        translatedItems.push({ ...item, ...translation, translations: undefined } as T);
        return;
      }

      translatedItems.push({ ...item, translations: undefined } as T);
    });

    return translatedItems;
  });
}
