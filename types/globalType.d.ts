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
    startDate: Date,
    endDate: Date,
    goal: string,
    content: string
}

interface GoalOnlyIdType extends ModalGoalType{
  _id: string
}
interface Account {}