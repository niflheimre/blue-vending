import {
  Button,
  Col,
  ConfigProvider,
  Modal,
  Popconfirm,
  Row,
  Space,
  Typography,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { product } from "../../data/product";

import placeholderImg from "../../assets/image/img-placeholder.png";
import { cash } from "../../data/cash";
import "./placeOrderModal.scss";
import usePlaceOrder from "../../hooks/usePlaceOrder";
import { getImageUrl } from "../../util/imageUtil";
import useGetCash from "../../hooks/useGetCash";
import { CloseOutlined } from "@ant-design/icons";

interface Props {
  product: product;
  visible: boolean;
  closeModal: Function;
}

const PlaceOrderModal: React.FC<Props> = ({
  product,
  visible,
  closeModal,
}: Props) => {
  const [deposit, setDeposit] = useState(0);
  const [cashIn, setCashIn] = useState<cash[]>([]);
  const {
    placeOrder,
  } = usePlaceOrder(product, cashIn);
  const { data: listMoney } = useGetCash();

  const insertCash = (cash: cash) => {
    setDeposit(deposit + cash.value);
    let cashList = [...cashIn];
    if (cashList.some((item) => item.id === cash.id)) {
      cashList = cashList.map((item) => {
        if (item.id === cash.id) {
          return { ...item, amount: item.amount ? (item.amount += 1) : 1 };
        }
        return item;
      });
    } else {
      cashList.push({ ...cash, amount: 1 });
    }
    setCashIn(cashList);
  };

  useEffect(() => {
    if (deposit >= product.price) {
      placeOrder();
      closeModal();
      setDeposit(0);
    }
  }, [closeModal, deposit, placeOrder, product]);

  const closeOrderModal = useCallback(() => {
    closeModal();
    if(cashIn.length > 0){
      Modal.info({
        title: "Info",
        content: (
          <div>
            <p>
              Please collect your cash
             
            </p>
            {cashIn!.length > 0 && (
              <>
                {cashIn!.map((cash) => (
                  <li>
                    {cash.value}฿ x{cash.amount}
                  </li>
                ))}
              </>
            )}
          </div>
        ),
      });
    }
  },[cashIn])

  return (
    <Modal
      className={"place-order-modal"}
      open={visible}
      closable={true}
      destroyOnClose={true}
      footer={null}
      maskClosable={false}
      closeIcon={
        <Button
          type="text"
          size={"small"}
          icon={<CloseOutlined />}
          onClick={() => {
            closeOrderModal();
          }}
        />
      }
      width={650}
    >
      <Row gutter={16} align={"stretch"}>
        <Col span={12}>
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
        </Col>
        <Col span={12}>
          <Space
            direction="vertical"
            style={{ height: "100%", justifyContent: "center" }}
          >
            <Row
              gutter={16}
              justify={"space-between"}
              style={{ marginBottom: "3rem" }}
            >
              <Col span={24}>
                <Typography.Title level={2}>{product.name}</Typography.Title>
              </Col>
              {product.description && (
                <Col span={24}>
                  <Typography.Text>{product.description}</Typography.Text>
                </Col>
              )}
            </Row>

            <Row gutter={16} justify={"space-between"} align={"bottom"}>
              <Col span={24}>
                <Typography.Title
                  level={4}
                  style={{ margin: 0, textAlign: "start" }}
                >
                  Price: ฿{product.price}
                </Typography.Title>
              </Col>
              <Col xs={24} md={{ span: 16 }}>
                <Typography.Title
                  level={3}
                  style={{ margin: 0, textAlign: "start" }}
                >
                  Deposit: ฿{deposit}
                </Typography.Title>
              </Col>
              <Col xs={24} md={{ span: 8 }}>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#003459",
                    },
                  }}
                >
                  <Popconfirm
                    icon={null}
                    title="Deposit money"
                    description={
                      <div className={"deposit-modal-description-container"}>
                        <Row gutter={[4, 16]}>
                          {listMoney
                            .sort((a, b) => a.value - b.value)
                            .map((cashStock) => {
                              return (
                                <Col
                                  xs={12}
                                  sm={12}
                                  md={8}
                                  lg={8}
                                  xl={6}
                                  xxl={6}
                                >
                                  <Button
                                    type="text"
                                    onClick={() => insertCash(cashStock)}
                                    block
                                  >
                                    ฿{cashStock.value}
                                  </Button>
                                </Col>
                              );
                            })}
                        </Row>
                      </div>
                    }
                    okText={"Close"}
                    okButtonProps={{
                      className: "deposit-popup-btn",
                      size: "middle",
                      type: "ghost",
                    }}
                    showCancel={false}
                  >
                    <Button className={"deposit-btn"} block>
                      + Deposit
                    </Button>
                  </Popconfirm>
                </ConfigProvider>
              </Col>
            </Row>
          </Space>
        </Col>
      </Row>
    </Modal>
  );
};

export default PlaceOrderModal;
