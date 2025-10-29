/**
 * Test data for the Blooms Academy automation tests
 * Centralized test data to follow DRY principle
 */

export interface UserData {
  username: string;
  password: string;
  name: string;
  role: string;
}

export interface TestData {
  url: string;
  validUser: UserData;
  invalidUser: {
    username: string;
    username2: string;
    password: string;
  };
  paymentnonpaymentUser: {
    username: string;
    password: string;
  };
  sectionData: {
    mockTestSectionName: string;
    answeroptionIndex: number;
  };
  ExamData: {
    PageName: string;
    tabName: string;
    CategoryName: string;
    SubCategoryName: string;
  };
  StudyMaterialData: {
    tabName: string;
    sectionName: string;
    downloadButton: string;
  };
  CollegeInfoData: {
    CategoryName: string;
  };
  OldQuestionPaperData: {
    tabName: string;
    sectionName: string;
    downloadButton: string;
  };
  SubscribetoNewsLetterData: {
    email: string;
  }
}

export const testData: TestData = {
  url: 'https://staging.bloomscareer.com/login',
  validUser: {
    username: '9952234924',
    password: '123456',
    name: 'Yazhini',
    role: 'Student',
  },
  invalidUser: {
    username: '9789440594',
    username2: 'abcd',
    password: 'abcd',
  },
  paymentnonpaymentUser: {
    username: '8489016157',
    password: '123456',
  },
  sectionData: {
    mockTestSectionName: 'Entrance Examinations',
    answeroptionIndex: 2,
  },
  ExamData: {
    PageName: 'Exam Updates',
    tabName: 'Competitive Examinations',
    CategoryName: 'Previous Exam Previous Exam',
    SubCategoryName: 'AFTER DIPLOMA',
  },
  StudyMaterialData: {
    tabName: 'CURRENT AFFAIRS',
    sectionName: 'OCTOBER 2024 CURRENT AFFAIRS',
    downloadButton: 'Download',
  },
  CollegeInfoData: {
    CategoryName: 'KARNATAKA',
  },
  OldQuestionPaperData: {
    tabName: 'ENTRANCE EXAMS',
    sectionName: 'CLAT',
    downloadButton: 'Download',
  },
  SubscribetoNewsLetterData:{
    email: 'test2025@yopmail.com',
}
};