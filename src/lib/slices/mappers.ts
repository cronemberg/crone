import contentIndexMapper from "./ContentIndex/mapper";

export const mappers = {
    content_index: contentIndexMapper,
    // Adicione outros slices se necessário para evitar erros de undefined
    hero: ({ slice }) => ({ slice }),
};