import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../src/components/SearchBar';

test('SearchBar calls onSearch on submit', () => {
  const onSearch = jest.fn();
  render(<SearchBar placeholder="검색" onSearch={onSearch} />);
  const input = screen.getByPlaceholderText(/검색/);
  fireEvent.change(input, { target: { value: '리튬' } });
  fireEvent.submit(input.closest('form') as HTMLElement);
  expect(onSearch).toHaveBeenCalledWith('리튬');
});