import React, { useMemo, useRef, useState } from 'react';

import banner from 'assets/images/banner.jpg';
import Button from 'components/atoms/Button';
import ColorSelect from 'components/atoms/ColorSelect';
import Icon from 'components/atoms/Icon';
import Image from 'components/atoms/Image';
import SizeSelect from 'components/atoms/SizeSelect';
import Typography from 'components/atoms/Typography';
import PriceSale from 'components/molecules/PriceSale';
import Animate from 'components/organisms/Animate';
import Container from 'components/organisms/Container';
import useWindowDimensions from 'hooks/useWindowDemensions';
import { ProductListItemData } from 'services/product/types';

interface HomeBannerProps {
  product?: ProductListItemData;
  handleScrollTo?: () => void;
}

const HomeBanner: React.FC<HomeBannerProps> = ({ product, handleScrollTo }) => {
  const { height } = useWindowDimensions();
  const [color, setColor] = useState<Color>();
  const [size, setSize] = useState<ProductProperty>();
  const ref = useRef<HTMLDivElement>(null);
  const colorWithSize: ColorWithSize | undefined = useMemo(() => {
    if (!product || !product.colorSize.length) {
      return undefined;
    }
    const data: ColorWithSize = product.colorSize.reduce((prev: any, curr) => ({
      ...prev,
      [curr.color.id.toString()]: prev[curr.color.id] ? {
        ...prev[curr.color.id],
        size: [...prev[curr.color.id].size, curr.size]
      }
        : {
          color: {
            id: curr.color.id,
            label: curr.color.name,
            color: curr.color.code
          },
          size: [curr.size]
        }
    }), {});
    setColor(data[Object.keys(data)[0]].color);
    return data;
  }, [product]);
  const sizeMemo: ProductProperty[] = useMemo(
    () => {
      if (!color || !colorWithSize) {
        return [];
      }
      const data = colorWithSize[color.id.toString()].size;
      setSize(data[0]);
      return data;
    },
    [color, colorWithSize]
  );
  return (
    <div className="t-homeBanner" ref={ref} style={{ maxHeight: `${height - 84}px` }}>
      <div className="t-homeBanner_background"><Image imgSrc={banner} alt="banner" ratio="16x9" /></div>
      {product && (
        <div className="t-homeBanner_content">
          <Container>
            <div className="t-homeBanner_title">
              <Animate type="fadeInLeft" noScroll extendClassName="animate-s1">
                <Typography.Heading type="h2" modifiers={['76x80', '500']}>{product.name}</Typography.Heading>
              </Animate>
              <Animate type="fadeInUp" noScroll extendClassName="animate-s1">
                <div className="t-homeBanner_product_price">
                  <PriceSale bigger isHorizontal unit="VNĐ" price={product.price} promo={product.salePercent} />
                </div>
              </Animate>
              {colorWithSize && (
                <>
                  <Animate type="fadeInUp" noScroll extendClassName="animate-s15">
                    <div className="t-homeBanner_product_colors">
                      {Object.keys(colorWithSize).map((key) => {
                        const item = colorWithSize[key];
                        return (
                          <div className="t-productInfo_color" key={`${item.color.id}-${item.color.color}`}>
                            <ColorSelect
                              name={`${product.code}color`}
                              checked={color?.id === item.color.id}
                              type="radio"
                              color={item.color.color}
                              onChange={() => setColor(item.color)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </Animate>
                  <Animate type="fadeInUp" noScroll extendClassName="animate-s15">
                    <div className="t-homeBanner_product_sizes">
                      {sizeMemo.map((item) => (
                        <div className="t-productInfo_size" key={item.code}>
                          <SizeSelect
                            name={`${product.code}size`}
                            type="radio"
                            checked={size?.id === item.id}
                            sizeName={item.name}
                            onChange={() => setSize(item)}
                          />
                        </div>
                      ))}
                    </div>
                  </Animate>
                </>
              )}
              <Animate type="fadeInUp" noScroll extendClassName="animate-s2">
                <div className="t-homeBanner_link">
                  <Button
                    variant="dark"
                    sizes="h48"
                  >
                    Thêm vào giỏ hàng
                  </Button>
                </div>
              </Animate>
            </div>
          </Container>
        </div>
      )}
      <div className="t-homeBanner_bottom" onClick={handleScrollTo}>
        <Container>
          <div className="t-homeBanner_bottom_wrapper">
            <Animate type="fadeInUp" noScroll extendClassName="animate-s3">
              <div className="t-homeBanner_bottom_decor" />
            </Animate>
            <div className="t-homeBanner_bottom_main">
              <Animate type="fadeInUp" noScroll extendClassName="animate-s25">
                <div className="t-homeBanner_bottom_content">
                  <div className="t-homeBanner_bottom_text">
                    <Typography.Heading type="h4" modifiers={['22x25']}>Chúng tôi không có sản phẩm bạn cần?</Typography.Heading>
                    <div className="t-homeBanner_bottom_description">
                      <Typography.Text modifiers={['16x18', '400']}>
                        Hãy cho để lại thông tin,
                        {' '}
                        <br />
                        chúng tôi sẽ tìm giúp bạn với giá cực tốt.
                      </Typography.Text>
                    </div>
                  </div>
                  <div className="t-homeBanner_bottom_icon">
                    <Icon iconName="scrollDown" size="32" />
                  </div>
                </div>
              </Animate>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

HomeBanner.defaultProps = {
};

export default HomeBanner;
