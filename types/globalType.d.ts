//--import/export 쓰면 전역파일로 인식함
type DateType = (string|number|Date)

type Diary = {date:string, content: string}

interface UserInfo {
  userid: string,
  username: string,
  email: string,
  birth: string,
  profile: string,
  provider: string,
  auth: boolean
}

type FormInput = {
    username: string,
    email: string,
    year: string,
    month: string,
    date: string,
    profile: File[],
    profileUrl: string
}

interface ModalGoalType {
    _id?: string,
    startDate: Date,
    endDate: Date,
    goal: string,
    content: string
}

interface GoalContext {
    params: {
        goalId: string;
    }
}

interface GoalDetailType{
  _id: string,
  userid: string,
  goalId: string,
  detailContent: string,
  completeAt: Date | null,
  createAt: Date,
}

interface Account {}