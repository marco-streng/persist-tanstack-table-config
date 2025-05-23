import { graphql, HttpResponse, type GraphQLQuery } from "msw";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type ColumnVisibility = { price?: boolean; name?: boolean; vegan?: boolean };

type TableConfig = {
  columnVisibility?: ColumnVisibility;
  sorting?: { id: keyof ColumnVisibility; desc: boolean }[];
};

const dbo: TableConfig = {
  columnVisibility: {
    price: true,
    name: true,
    vegan: false,
  },
  sorting: [
    {
      id: "name",
      desc: true,
    },
  ],
};

export const handlers = [
  graphql.query("tableConfig", () => {
    return HttpResponse.json({
      data: dbo,
    });
  }),

  graphql.mutation<
    GraphQLQuery,
    {
      input: TableConfig;
    }
  >(
    "updateTableConfig",
    async ({
      variables: {
        input: { columnVisibility, sorting },
      },
    }) => {
      if (columnVisibility) {
        dbo.columnVisibility = columnVisibility;
      }

      if (sorting) {
        dbo.sorting = sorting;
      }

      // Simulate slow request for optimistic UI implementation
      await sleep(1000);

      return HttpResponse.json({
        data: dbo,
      });
    }
  ),
];
