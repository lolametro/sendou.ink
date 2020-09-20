import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { initializeApollo } from "graphql/client";
import Link from "next/link";

const ViewerQuery = gql`
  query ViewerQuery {
    viewer {
      id
      name
      status
    }
  }
`;

const Index = () => {
  const {
    data: { viewer },
  } = useQuery(ViewerQuery);

  return (
    <div>
      You're signed in as {viewer.name} and you're {viewer.status} goto{" "}
      <Link href="/about">
        <a>static</a>
      </Link>{" "}
      page.
    </div>
  );
};

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: ViewerQuery,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}

export default Index;