import React, { useState } from 'react';
import { Upload, Button, Form, Input, Card, message, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { parsePDF, parseDOCX } from '../utils/resumeParser';
import { generateCandidateId } from '../utils/sessionUtils';
import { Candidate } from '../types';

interface ResumeUploadProps {
  onUpload: (candidate: Candidate) => void;
  existingCandidate?: Candidate | null;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onUpload, existingCandidate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    try {
      let data;
      if (file.type === 'application/pdf') {
        data = await parsePDF(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        data = await parseDOCX(file);
      } else {
        message.error('Please upload a PDF or DOCX file');
        setLoading(false);
        return false;
      }

      setExtractedData(data);
      
      // Pre-fill form with extracted data
      form.setFieldsValue({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
      });

      message.success('Resume parsed successfully! Please review and complete any missing information.');
    } catch (error) {
      message.error('Failed to parse resume. Please try again.');
      console.error('Resume parsing error:', error);
    } finally {
      setLoading(false);
    }
    return false; // Prevent default upload
  };

  const handleSubmit = (values: any) => {
    if (!values.name || !values.email || !values.phone) {
      message.error('Please fill in all required fields');
      return;
    }

    const candidate: Candidate = {
      id: existingCandidate?.id || generateCandidateId(),
      name: values.name,
      email: values.email,
      phone: values.phone,
      resumeUrl: extractedData?.text || '',
      interviewStatus: 'not_started',
      currentQuestionIndex: 0,
      answers: [],
    };

    onUpload(candidate);
  };

  return (
    <Card title="Upload Resume" style={{ maxWidth: 600, margin: '0 auto' }}>
      <Spin spinning={loading}>
        <div style={{ marginBottom: 24 }}>
          <Upload
            beforeUpload={handleFileUpload}
            accept=".pdf,.docx"
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />} size="large">
              Upload Resume (PDF or DOCX)
            </Button>
          </Upload>
          <p style={{ marginTop: 8, color: '#666' }}>
            Supported formats: PDF, DOCX
          </p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            name: existingCandidate?.name || '',
            email: existingCandidate?.email || '',
            phone: existingCandidate?.phone || '',
          }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Enter your email address" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please enter your phone number' }]}
          >
            <Input placeholder="Enter your phone number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Continue to Interview
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
};

export default ResumeUpload;
