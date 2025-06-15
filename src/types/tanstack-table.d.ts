import '@tanstack/react-table'

declare module '@tanstack/react-table' {
  interface FilterFns {
    dateRange: FilterFn<unknown>
    amountRange: FilterFn<unknown>
    global: FilterFn<unknown>
  }

  interface FilterMeta {
    dateFrom?: Date
    dateTo?: Date
    amountMin?: string
    amountMax?: string
  }
}
