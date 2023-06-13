import "./App.scss";
import { Col, Empty, Row, Typography } from "antd";
import ProductCard from "./component/product/productCard";
import { product } from "./data/product";
import useGetProduct from "./hooks/useGetProduct";
import useGetCash from "./hooks/useGetCash";

function App() {
  const { data, error, loading } = useGetProduct(
    process.env.REACT_APP_BRANCH_ID
  );

  return (
    <div className="App">
      <div className={"back-drop"}>
        <Typography.Title style={{ color: "#edf2f4", fontSize: "3rem" }}>
          Blue Vending
        </Typography.Title>
        <Typography.Text
          style={{
            color: "#edf2f4",
            lineHeight: "4rem",
            margin: "2.5rem 0.5rem 0.5rem",
          }}
        >
          Virtual vending machine
        </Typography.Text>
      </div>
      <div className={"product-list"}>
        <Row gutter={[20, 20]}>
          {data &&
            data.map((product) => (
              <Col xs={12} sm={12} md={8} lg={8} xl={6} xxl={6}>
                <ProductCard key={product.id} product={product} />
              </Col>
            ))}
        </Row>
        {error && <Empty description={<span>No Data</span>} />}
      </div>
    </div>
  );
}

export default App;
