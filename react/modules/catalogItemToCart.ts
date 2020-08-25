import {
  transformAssemblyOptions,
  sumAssembliesPrice,
  ParsedAssemblyOptionsMeta,
  Option,
} from './assemblyOptions'

export interface CartItem {
  detailUrl: string
  id: string
  ean: string
  imageUrl: string
  index?: number
  listPrice: number
  measurementUnit: string
  name: string
  price: number
  productId: string
  quantity: number
  seller: string
  sellingPrice: number
  productRefId: string
  brand: string
  variant: string
  category: string
  skuName: string
  skuSpecifications: SKUSpecification[]
  uniqueId: string
  sellingPriceWithAssemblies: number
  options: Option[]
  assemblyOptions: ParsedAssemblyOptionsMeta
  referenceId: ProductContextItem['referenceId']
}

interface MapCatalogItemToCartArgs {
  product: ProductContextState['product']
  selectedItem: Maybe<ProductContextItem>
  selectedQuantity: number
  selectedSeller: any
  assemblyOptions?: {
    items: Record<string, AssemblyOptionItem[]>
    inputValues: Record<string, Record<string, string>>
    areGroupsValid: Record<string, boolean>
  }
}

export function mapCatalogItemToCart({
  product,
  selectedItem,
  selectedQuantity,
  selectedSeller,
  assemblyOptions,
}: MapCatalogItemToCartArgs): CartItem[] {
  if (
    !product ||
    !selectedItem ||
    !selectedSeller ||
    !selectedSeller.commertialOffer
  ) {
    return []
  }

  return [
    {
      index: 0,
      id: selectedItem.itemId,
      ean: selectedItem.ean,
      productId: product.productId ?? '',
      quantity: selectedQuantity,
      uniqueId: '',
      detailUrl: `/${product.linkText}/p`,
      name: product.productName ?? '',
      brand: product.brand ?? '',
      category:
        product.categories && product.categories.length > 0
          ? product.categories[0]
          : '',
      productRefId: product.productReference ?? '',
      seller: selectedSeller.sellerId,
      variant: selectedItem.name,
      skuName: selectedItem.name,
      price: selectedSeller.commertialOffer.PriceWithoutDiscount * 100,
      listPrice: selectedSeller.commertialOffer.ListPrice * 100,
      sellingPrice: selectedSeller.commertialOffer.Price * 100,
      sellingPriceWithAssemblies:
        ((selectedSeller.commertialOffer.Price as number) +
          sumAssembliesPrice(assemblyOptions?.items ?? {})) *
        100,
      measurementUnit: selectedItem.measurementUnit,
      skuSpecifications: [],
      imageUrl: selectedItem.images[0]?.imageUrl,
      ...transformAssemblyOptions({
        assemblyOptionsItems: assemblyOptions?.items,
        inputValues: assemblyOptions?.inputValues,
        parentPrice: selectedSeller.commertialOffer.Price,
        parentQuantity: selectedQuantity,
      }),
      referenceId: selectedItem.referenceId,
    },
  ]
}
