import React, { useState } from 'react';
import { Card, Table, Input, Button, Tag, Modal, Descriptions, Typography } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { getScoreColor, getScoreLabel } from '../utils/sessionUtils';
import { Candidate } from '../types';

const { Search } = Input;
const { Title, Paragraph } = Typography;

const InterviewerTab: React.FC = () => {
  const { candidates } = useSelector((state: RootState) => state.interview);
  const [searchText, setSearchText] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredCandidates = candidates.filter((candidate: Candidate) =>
    candidate.name.toLowerCase().includes(searchText.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (a.finalScore && b.finalScore) {
      return b.finalScore - a.finalScore;
    }
    if (a.finalScore && !b.finalScore) return -1;
    if (!a.finalScore && b.finalScore) return 1;
    return 0;
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Candidate, b: Candidate) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Status',
      dataIndex: 'interviewStatus',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          'not_started': { color: 'default', text: 'Not Started' },
          'in_progress': { color: 'processing', text: 'In Progress' },
          'completed': { color: 'success', text: 'Completed' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Score',
      dataIndex: 'finalScore',
      key: 'score',
      render: (score: number) => {
        if (score === undefined) return '-';
        return (
          <span className={`score-badge ${getScoreColor(score)}`}>
            {score}/100 ({getScoreLabel(score)})
          </span>
        );
      },
      sorter: (a: Candidate, b: Candidate) => (a.finalScore || 0) - (b.finalScore || 0),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Candidate) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
          disabled={record.interviewStatus !== 'completed'}
        >
          View Details
        </Button>
      ),
    },
  ];

  const handleViewDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedCandidate(null);
  };

  const renderCandidateDetails = () => {
    if (!selectedCandidate) return null;

    return (
      <div>
        <Title level={3}>{selectedCandidate.name}</Title>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Email">{selectedCandidate.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{selectedCandidate.phone}</Descriptions.Item>
          <Descriptions.Item label="Final Score">
            <span className={`score-badge ${getScoreColor(selectedCandidate.finalScore || 0)}`}>
              {selectedCandidate.finalScore}/100 ({getScoreLabel(selectedCandidate.finalScore || 0)})
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Interview Status">
            <Tag color={selectedCandidate.interviewStatus === 'completed' ? 'success' : 'processing'}>
              {selectedCandidate.interviewStatus === 'completed' ? 'Completed' : 'In Progress'}
            </Tag>
          </Descriptions.Item>
        </Descriptions>

        {selectedCandidate.summary && (
          <div style={{ marginTop: 24 }}>
            <Title level={4}>AI Summary</Title>
            <Paragraph>{selectedCandidate.summary}</Paragraph>
          </div>
        )}

        {selectedCandidate.answers && selectedCandidate.answers.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <Title level={4}>Interview Questions & Answers</Title>
            {selectedCandidate.answers.map((answer, index) => (
              <Card key={answer.questionId} style={{ marginBottom: 16 }}>
                <Title level={5}>Question {index + 1} ({answer.difficulty.toUpperCase()})</Title>
                <Paragraph>{answer.question}</Paragraph>
                <Title level={5}>Answer:</Title>
                <Paragraph>{answer.answer}</Paragraph>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                  <span>Score: <strong className={getScoreColor(answer.score)}>{answer.score}/100</strong></span>
                  <span>Time Spent: {answer.timeSpent}s</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>Interview Dashboard</Title>
        <Search
          placeholder="Search candidates..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
          prefix={<SearchOutlined />}
        />
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={sortedCandidates}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} candidates`,
          }}
        />
      </Card>

      <Modal
        title="Candidate Details"
        open={showDetailModal}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Close
          </Button>,
        ]}
        width={800}
        style={{ top: 20 }}
      >
        {renderCandidateDetails()}
      </Modal>
    </div>
  );
};

export default InterviewerTab;
