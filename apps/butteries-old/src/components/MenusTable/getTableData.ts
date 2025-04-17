import { Buttery } from 'src/shared/butteries';

type RowMenuItem = {
  Name: string;
  Price?: boolean;
  'Residential College'?: Buttery['id'];
  Category?: string;
};
export type ColumnName = keyof RowMenuItem;
export async function getTableData(filterId: Buttery['id'] | null = null) {
  const res = await fetch(
    'https://opensheet.elk.sh/1NZyxbnUMkChmZC3umrW8vJdyus6PdPyRq8GbDLZiglU/Menus'
  );
  const data = (await res.json()) as RowMenuItem[];
  return !filterId
    ? data
    : data.filter(
        (item: RowMenuItem) => item['Residential College'] === filterId
      );
}

export type Column = {
  name: ColumnName;
  label: ColumnName;
  field: ColumnName;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  required?: boolean;
};
