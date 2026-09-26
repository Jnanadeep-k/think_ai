import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CodePlayground from './CodePlayground';
import { runCode } from '../../api/codeExecutionApi';
import { ThemeProvider } from '../../../components/ThemeContext';

jest.mock('../../api/codeExecutionApi');
jest.mock('@monaco-editor/react', () => (props) => (
  <textarea
    data-testid="mock-editor"
    value={props.value}
    onChange={(e) => props.onChange(e.target.value)}
  />
));

function renderPlayground() {
  return render(
    <ThemeProvider>
      <CodePlayground />
    </ThemeProvider>
  );
}

describe('CodePlayground', () => {
  afterEach(() => jest.clearAllMocks());

  test('renders default JavaScript snippet', () => {
    renderPlayground();
    expect(screen.getByTestId('mock-editor').value).toMatch(/greet/);
  });

  test('switching language resets the snippet', () => {
    renderPlayground();
    fireEvent.change(screen.getByLabelText('Select language'), { target: { value: 'python' } });
    expect(screen.getByTestId('mock-editor').value).toMatch(/def greet/);
  });

  test('running code shows loading then success output', async () => {
    runCode.mockResolvedValue({ stdout: 'Hello, world!', stderr: '', exitCode: 0 });
    renderPlayground();

    fireEvent.click(screen.getByRole('button', { name: /Run/i }));
    expect(screen.getByText(/Running…/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('Hello, world!')).toBeInTheDocument());
    expect(runCode).toHaveBeenCalledWith({ language: 'javascript', code: expect.any(String) });
  });

  test('shows error state when execution fails', async () => {
    runCode.mockRejectedValue(new Error('Execution timed out.'));
    renderPlayground();

    fireEvent.click(screen.getByRole('button', { name: /Run/i }));
    await waitFor(() => expect(screen.getByText('Execution timed out.')).toBeInTheDocument());
    expect(screen.getByText('error')).toBeInTheDocument();
  });
});