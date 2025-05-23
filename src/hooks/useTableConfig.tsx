import {
  useMutation,
  useQuery,
  useQueryClient,
  type DefaultError,
} from "@tanstack/react-query";
import type {
  OnChangeFn,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import request from "graphql-request";
import { tableConfigQuery, updateTableConfigMutation } from "../gql";

const API = "http://localhost:3000/graphql";

type ColumnVisibility = { price?: boolean; name?: boolean; vegan?: boolean };
type Sorting = { id: keyof ColumnVisibility; desc: boolean };

type TableConfig = {
  columnVisibility?: ColumnVisibility;
  sorting?: Sorting[];
};

export const useTableConfig = () => {
  const queryClient = useQueryClient();
  const queryKey = ["tableConfig"];

  const { data: tableConfig, isLoading } = useQuery<TableConfig>({
    queryKey,
    queryFn: async () => request(API, tableConfigQuery),
  });

  const { mutateAsync: updateTableConfig, isPending } = useMutation<
    TableConfig,
    DefaultError,
    { input: TableConfig },
    {
      tableConfig: TableConfig;
      previousTableConfig?: TableConfig;
    }
  >({
    mutationFn: async (variables) =>
      request(API, updateTableConfigMutation, variables),
    onMutate: async (tableConfig) => {
      await queryClient.cancelQueries({ queryKey: queryKey });

      const previousTableConfig =
        queryClient.getQueryData<TableConfig>(queryKey);

      queryClient.setQueryData<TableConfig>(queryKey, {
        ...previousTableConfig,
        ...tableConfig.input,
      });

      return {
        tableConfig: tableConfig.input,
        previousTableConfig,
      };
    },
    onError: (_error, _tableConfig, context) => {
      if (context?.previousTableConfig) {
        queryClient.setQueryData<TableConfig>(
          queryKey,
          context.previousTableConfig
        );
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const setColumnVisibility: OnChangeFn<VisibilityState> = async (
    updaterOrValue
  ) => {
    const newVisibilityState =
      typeof updaterOrValue === "function"
        ? updaterOrValue(tableConfig?.columnVisibility ?? {})
        : updaterOrValue;

    await updateTableConfig({
      input: {
        columnVisibility: newVisibilityState,
      },
    });

    return newVisibilityState;
  };

  const setSorting: OnChangeFn<SortingState> = async (updaterOrValue) => {
    const newSortingState = (
      typeof updaterOrValue === "function"
        ? updaterOrValue(tableConfig?.sorting ?? [])
        : updaterOrValue
    ).filter((s): s is Sorting => ["price", "name", "vegan"].includes(s.id));

    await updateTableConfig({
      input: {
        sorting: newSortingState,
      },
    });

    return newSortingState;
  };

  return {
    isLoading,
    isUpdating: isPending,
    columnVisibility: tableConfig?.columnVisibility ?? {},
    sorting: tableConfig?.sorting ?? [],
    setColumnVisibility,
    setSorting,
  };
};
