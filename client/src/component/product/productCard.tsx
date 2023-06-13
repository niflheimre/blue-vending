import { Card, Col, Row, Typography } from "antd";
import React from "react";
import { product } from "../../data/product";
import placeholderImg from "../../assets/image/img-placeholder.png";
import PlaceOrderModal from "../modal/placeOrderModal";
import useModal from "../../hooks/useModal";
import { getImageUrl } from "../../util/imageUtil";

type Props = {
  product: product;
};

const ProductCard: React.FC<Props> = (props: Props) => {
  const { product } = props;
  const { isOpen, toggle } = useModal();

  return (
    <>
      <Card
        style={{ height: "100%" }}
        hoverable
        cover={
          <img
            alt={product.name}
            src={getImageUrl(product.imagePath)}
            style={{
              width: "100%",
              aspectRatio: "1 / 1",
              objectFit: "contain",
            }}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = placeholderImg;
            }}
          />
        }
        onClick={() => {
          toggle();
        }}
      >
        <Row justify={"space-between"}>
          <Col span={12}>
            <div>
              <Typography.Title level={4} style={{ margin: " 0 0 1rem" }}>
                {product.name}
              </Typography.Title>
            </div>
          </Col>
          <Col span={10}>
            <Typography.Title
              level={4}
              style={{ margin: " 0 0 1rem", textAlign: "end" }}
            >
              ฿ {product.price.toLocaleString()}
            </Typography.Title>
          </Col>
        </Row>
      </Card>
      {isOpen && (
        <PlaceOrderModal
          visible={isOpen}
          product={product}
          closeModal={toggle}
        />
      )}
    </>
  );
};

export default ProductCard;
