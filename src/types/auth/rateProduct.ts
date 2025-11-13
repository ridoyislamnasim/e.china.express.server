export default interface RateProductPayload {
  // Category fields
  categoryName: string;
  categoryShCode: string;
  categoryDescription?: string | null;

  // Subcategory fields
  subCategoryName: string;
  subCategoryShCode: string;
  subCategoryDescription?: string | null;

  // Subheading fields
  subHeadingName: string;
  subHeadingShCode: string;
  subHeadingDescription?: string | null;

  // Rate Product fields
  productName: string;
  productShCode: string;
  status: string;
}
