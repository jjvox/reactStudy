import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import styles from './ListContainer.module.css';
import Button from './components/Button';
import ListItem from './components/ListItem';
import { ListItem as ListItemType } from './model/Issues';
import ListItemLayout from './components/ListItemLayout';
import ListFilter from './components/ListFilter';
import Pagination from './components/Pagination';
import OpenClosedFilters from './components/OpenClosedFilters';
import { GITHUB_API } from './constent/api';

export default function ListContainer() {
  const [inputValue, setInputValue] = useState('is:pr is:open');
  const [list, setList] = useState<ListItemType[]>([]);
  // url path의 '?' 뒷부분인 query string 부분을 가져오는 hook
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') ?? '1', 10); // console.log(searchParams.get('page'))
  const state = searchParams.get('state'); // state라는 인름으로 들어오는 searchParams를 가져온다. (key값은 직접 정해도 된다.)

  async function getData(parameter: URLSearchParams) {
    const { data } = await axios.get(
      `${GITHUB_API}/repos/facebook/react/issues`,
      { params: parameter }, // 옵션 값들을 parameter로 전달. parameter는 객체다.
    );
    setList(data);
  }

  useEffect(() => {
    getData(searchParams);
  }, [searchParams]);

  return (
    <>
      <div className={styles.listContainer}>
        <div className={styles.topSection}>
          <input
            className={styles.input}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Link to="/new" className={styles.link}>
            <Button className={styles.issueButton}>New issue</Button>
          </Link>
        </div>
        <OpenClosedFilters
          isOpenMode={state !== 'closed'}
          onClickMode={(filterMode) => setSearchParams({ state: filterMode })}
        />
        <ListItemLayout className={styles.listFilter} style={{ padding: 16 }}>
          <ListFilter onChangeFilter={(params) => setSearchParams(params)} />
        </ListItemLayout>
        <div className={styles.container}>
          {list.map((listItem) => (
            <ListItem key={listItem.id} data={listItem} />
          ))}
        </div>
      </div>
      <div className={styles.paginationContainer}>
        <Pagination
          maxPage={10}
          currentPage={page}
          onClick={(pageNumber) =>
            setSearchParams({ page: pageNumber.toString() })
          }
        />
      </div>
    </>
  );
}
