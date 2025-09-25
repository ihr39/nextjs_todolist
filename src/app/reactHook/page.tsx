'use client'
import { useForm, SubmitHandler, UseControllerProps, useController } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

type FormType = {name: string, age: number, type: string}

const schema = yup.object({
    firstName: yup.string().required(),
    age: yup.number().positive().integer().required(),
}).required()

export default function ReactHook(){
    // const {
    //     handleSubmit,
    //     register,
    //     watch,
    //     formState: {errors},
    //     control,
    // } = useForm<FormType>({
    //     defaultValues: {
    //         name: '이름이요'
    //     },
    //     resolver: yupResolver(schma)
    // })
    //const onSubmit: SubmitHandler<FormType> = (data)=>console.log(data)

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    })
    const onSubmit= (data)=>console.log(data)
    
    //console.log(watch("name")) //-- 값이 변경될 때마다 찍힘

    return(
        <form className="bg-cyan-500" onSubmit={handleSubmit(onSubmit)}>
            {/* <div>
                <label>이름</label>
                <input type="text" id="name" {...register("name", {required: true, minLength:2})} 

                    className="form-input w-[30%] bg-white"
                />
                {errors.name && <span>필수값임</span>} 
                // .type == 'required'면 값이 없을 때 체크 그냥 쓰면 위에 길이 제한이 있는데 그거에 부적합해도 뜸
                
            </div>
            <div>
                <label>나이</label>
                <input type="text" {...register('age',{required: "이것 뭐에요~?"})} className="form-input w-[10%] bg-white"/>
                {errors.age && <p role="alert">{errors.age.message}</p>} //required에 적힌 메시지 출력 
            </div>
            <div>
                <label>타입</label>
                <select id="type">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </select>
            </div> */}
            <input {...register("firstName", {required:'이름입력하쇼'})} />
            <p>{errors.firstName?.message}</p>

            <input {...register("age")} />
            <p>{errors.age?.message}</p>
            <button onClick={()=>{
                setValue('firstName','kim') //--값 세팅해줌 => 무조건 kim으로 바꿔서 수정함
            }}>전송</button>
        </form>
    )
}
