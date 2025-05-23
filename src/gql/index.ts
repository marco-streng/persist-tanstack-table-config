import { gql } from "graphql-request";

export const tableConfigQuery = gql`
  query tableConfig {
    tableConfig {
      columnVisibilty {
        price
        name
        vegan
      }
    }
  }
`;

export const updateTableConfigMutation = gql`
  mutation updateTableConfig($input: UpdateTableConfigInput) {
    updateTableConfig(input: $input) {
      columnVisibilty {
        price
        name
        vegan
      }
    }
  }
`;
