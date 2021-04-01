import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
 
const queryClient = new QueryClient();

const App = () => {
  return ( 
    <QueryClientProvider client={queryClient}>
      <h1>React-Query Test</h1>
      <Example />
    </QueryClientProvider>
  );
};


const Example = () => {
  const { isLoading, error, data, isFetching } = useQuery('repoData', () => 
    fetch(
      "https://api.github.com/repos/tannerlinsley/react-query"
    ).then((res) => res.json())
  );

  if (isLoading) return 'Loading...';

  if (error) return 'An error has occured: ' + error.message;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{" "}
      <strong>✨ {data.stargazers_count}</strong>{" "}
      <strong>🍴 {data.forks_count}</strong>
      <div>{isFetching ? 'Updating...' : ''}</div>
      <ReactQueryDevtools initialIsOpen />
    </div>
  );
}

export default App;