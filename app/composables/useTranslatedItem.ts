export function useTranslatedItem<T extends TranslatableItem>(
  item: Ref<T | undefined> | T | undefined,
  locale: MaybeRef<string> = "fr",
): ComputedRef<T | null> {
  return computed(() => {
    const data = unref(item);
    const lang = unref(locale);
    const languageCode = lang == "en" ? "en-US" : "fr-FR";

    if (!data) return null;

    // Find translation matching locale
    const translation = data.translations?.find(
      (t) => (t as Translatable).languages_code === languageCode,
    ) as T | undefined;

    // Merge: translation fields override base fields
    if (translation) {
      return { ...data, ...translation, translations: undefined } as T;
    }

    return { ...data, translations: undefined } as T;
  });
}