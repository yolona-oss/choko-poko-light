import { SubCategoryDocument } from "./../schemas/sub-category.schema";

export interface FiltredSubCategoryList {
    subCategoryList: SubCategoryDocument[],
    totalPages: number,
    page: number
}

