import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FaSpinner, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import PropTypes from 'prop-types';

import api from '../../services/api';

import Container from '../../components/Container';
import Loading from '../../components/Loading';
import { Owner, Select, Pagination, IssueList } from './styles';

export default class Repository extends Component {
  // eslint-disable-next-line react/static-property-placement
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    loading: true,
    page: 1,
  };

  async componentDidMount() {
    const { match } = this.props;
    const { page } = this.state;

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`repos/${repoName}`),
      api.get(`repos/${repoName}/issues`, {
        params: {
          state: 'open',
          per_page: 5,
          page,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  handleChangeStatus = async e => {
    const state = e.target.value;
    const { repository, page } = this.state;

    const issues = await api.get(`/repos/${repository.full_name}/issues`, {
      params: {
        state,
        per_page: 5,
        page,
      },
    });

    this.setState({
      issues: issues.data,
    });
  };

  handlePagePrevius = async e => {
    const { state, repository, page } = this.state;
    const newPage = page - 1;

    if (newPage <= 0) {
      return;
    }

    const issues = await api.get(`/repos/${repository.full_name}/issues`, {
      params: {
        state,
        per_page: 5,
        page: newPage,
      },
    });

    this.setState({
      issues: issues.data,
      page: newPage,
    });
  };

  handlePageForward = async e => {
    const { state, repository, page } = this.state;
    const newPage = page + 1;

    if (newPage <= 0) {
      return;
    }

    const issues = await api.get(`/repos/${repository.full_name}/issues`, {
      params: {
        state,
        per_page: 5,
        page: newPage,
      },
    });

    this.setState({
      issues: issues.data,
      page: newPage,
    });
  };

  render() {
    const { repository, issues, loading, page } = this.state;

    if (loading) {
      return (
        <Loading>
          <FaSpinner color="#FFF" size={50} />
        </Loading>
      );
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>
        <Select onChange={this.handleChangeStatus}>
          <option value="all">Todas</option>
          <option value="open">Abertas</option>
          <option value="closed">Fechadas</option>
        </Select>
        <Pagination>
          <div>
            <FaArrowLeft
              size={18}
              color="#000"
              value={page + 1}
              onClick={this.handlePagePrevius}
            />
            <FaArrowRight
              size={18}
              color="#000"
              value={page - 1}
              onClick={this.handlePageForward}
            />
          </div>
          <p>Pagína {page}</p>
        </Pagination>
        <IssueList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
      </Container>
    );
  }
}
