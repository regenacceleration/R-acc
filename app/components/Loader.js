import { LoadingOutlined } from "@ant-design/icons";

export function BtnLoader() {
  return <LoadingOutlined spin delay={500} className='text-black' />;
}

export function Loader({ className }) {
  return (
    <LoadingOutlined
      spin
      delay={500}
      className={`${className} text-6xl text-black`}
    />
  );
}
