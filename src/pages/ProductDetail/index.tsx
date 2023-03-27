/* eslint-disable react/no-danger */
import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { featuredProducts } from 'assets/dummy/homepage';
import Breadcrumb from 'components/molecules/Breadcrumb';
import Container from 'components/organisms/Container';
import Tabs from 'components/organisms/Tabs';
import FooterProduct from 'components/templates/FooterProduct';
import ProductInfo from 'components/templates/ProductInfo';
import { getProductDetailService } from 'services/product';

const ProductDetail: React.FC = () => {
  const { product: slug } = useParams<{ product: string }>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, isLoading } = useQuery(
    ['getProductDetail', slug],
    () => {
      if (slug) {
        return getProductDetailService(slug);
      }
      return undefined;
    }
  );
  const productDetail: ProductInfo | undefined = useMemo(() => (data ? ({
    code: data.code,
    images: data.galleries.map((item) => item.path),
    name: data.name,
    description: data.shortDescription,
    promo: data.salePercent,
    price: data.price,
    unit: 'VNĐ',
    starCount: 5,
    reviewCount: 2,
    colors: data.colors.map((item) => ({
      code: item.id.toString(),
      label: item.name,
      color: item.code
    })),
    sizes: data.sizes.map((item) => ({
      code: item.id.toString(),
      label: item.name,
      color: item.code
    })),
    categories: data.categories.map((item) => item.name),
  }) : undefined), [data]);
  if (!productDetail) {
    return null;
  }
  const breadcrumbs: BreadcrumbTypes[] = [
    {
      slug: '/',
      text: 'Trang chủ',
    },
    ...(!data ? [] : data.categories.map((item) => ({ slug: `/${item.slug}`, text: item.name }))),
    {
      slug: '',
      text: data?.name || ''
    }
  ];
  return (
    <div className="p-productDetail">
      <Container>
        <Breadcrumb breadcrumbs={breadcrumbs} />
        <div className="p-productDetail_content">
          <ProductInfo {...productDetail} />
        </div>
        <div className="p-productDetail_tabs">
          <Tabs tabs={['Mô tả sản phẩm']} modifiers={['underline']}>
            <div dangerouslySetInnerHTML={{ __html: productDetail.description }} />
          </Tabs>
        </div>
        <div className="p-productDetail_related">
          <FooterProduct title="Sản phẩm liên quan" products={featuredProducts.slice(0, 4)} />
        </div>
      </Container>
    </div>
  );
};

export default ProductDetail;
