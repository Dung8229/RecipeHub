import Layout from './layout';

const withLayout = (Component) => {
  // eslint-disable-next-line react/display-name
  return (props) => (
    <Layout>
      <Component {...props} />
    </Layout>
  );
};

export default withLayout;
