import React, { useState } from 'react';
import { useRouter } from 'next/router';
import signupStyle from '../styles/Signup.module.css';
import { timeToString } from '@/utils/CommonUtils';
import axios from 'axios';

//mui notification
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';

const Signup = () => {
  //이메일
  const [email, setEmail] = useState('');
  const [emailValidate, setEmailValidate] = useState<boolean>(true);
  //비밀번호
  const [password, setPassword] = useState('');
  const [passwordValidate, setPasswordValidate] = useState<boolean>(true);
  //비밀번호 확인
  const [pwDoubleCheckText, setPwDoubleCheckText] = useState('');
  const [pwDoubleValidate, setPwDoubleValidate] = useState<boolean>(true);
  //닉네임
  const [nickname, setNickname] = useState('');
  const [nicknameValidate, setNicknameValidate] = useState<boolean>(true);
  //notification 팝업
  const [showNoti, setShowNoti] = useState(false);

  const router = useRouter();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //email, password 유효성 검사
    if (!(await emailCheck(email))) {
      return;
    } else if (!passwordCheck(password)) {
      return;
    } else if (!passwordDoubleCheck(pwDoubleCheckText)) {
      return;
    } else if (!nicknameCheck(nickname)) {
      return;
    }
    const currentTime = timeToString(new Date());
    const params = { type: 'signup', email: email, nickname: nickname.replaceAll(' ', ''), password: password, rgsn_dttm: currentTime, amnt_dttm: currentTime };

    axios.post('/api/HandlePost', { data: params }).then((res) => {
      setShowNoti(true);
    });
  };

  const emailCheck = async (email: string) => {
    const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let isValidate = emailRegEx.test(email);
    const params = { type: 'getUser', email: email };

    if (!isValidate) {
      setEmailValidate(false);
      document.querySelector('.emailErrMsg')!.innerHTML = '<div class="mt5">이메일 형식이 올바르지 않습니다.</div>';
    } else {
      //Email 중복검사
      await axios.post('/api/HandlePost', { data: params }).then((res) => {
        const userCnt = res.data.totalItems;
        if (userCnt > 0) {
          isValidate = false;
          document.querySelector('.emailErrMsg')!.innerHTML = '<div class="mt5">이미 가입되어 있는 이메일입니다.</div>';
        } else {
          setEmailValidate(true);
          document.querySelector('.emailErrMsg')!.innerHTML = '';
        }
      });
    }

    return isValidate;
  };

  const passwordCheck = (password: string) => {
    //8~16자의 영문 대/소문자, 숫자를 반드시 포함하여 구성(특수문자도 포함가능)
    const passwordRegEx = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\S]{8,16}$/;
    const isValidate = passwordRegEx.test(password);

    if (!isValidate) {
      setPasswordValidate(false);
      document.querySelector('.passwordErrMsg')!.innerHTML = '<div class="mt5">비밀번호: 8~16자의 영문 대/소문자, 숫자를 사용해 주세요.</div>';
    } else {
      setPasswordValidate(true);
      document.querySelector('.passwordErrMsg')!.innerHTML = '';
    }

    return isValidate;
  };

  const passwordDoubleCheck = (passwordText: string) => {
    const isValidate = password === passwordText ? true : false;
    if (!isValidate) {
      setPwDoubleValidate(false);
      document.querySelector('.pwDobleCheckErrMsg')!.innerHTML = '<div class="mt5">비밀번호가 일치하지 않습니다.</div>';
    } else {
      setPwDoubleValidate(true);
      document.querySelector('.pwDobleCheckErrMsg')!.innerHTML = '';
    }
    return isValidate;
  };

  const nicknameCheck = (nickname: string) => {
    const isValidate = nickname.replaceAll(' ', '').length === 0 ? false : true;
    if (!isValidate) {
      setNicknameValidate(false);
      document.querySelector('.nicknameErrMsg')!.innerHTML = '<div class="mt5">닉네임을 입력해주세요.</div>';
    } else {
      setNicknameValidate(true);
      document.querySelector('.nicknameErrMsg')!.innerHTML = '';
    }
    return isValidate;
  };

  const closeNoti = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowNoti(false);
    router.replace('/login');
  };

  return (
    <div className={signupStyle.signup_div}>
      <span className={signupStyle.signup_title}>keylog</span>
      <form
        onSubmit={submitHandler}
        className={signupStyle.signup_form}>
        <div className={signupStyle.signup_input_div}>
          <div className={`${signupStyle.signup_emoji} ${emailValidate ? '' : signupStyle.validateErr} btlr`}>
            <i className={'fa-solid fa-envelope'}></i>
          </div>
          <input
            type='text'
            value={email}
            className={`${signupStyle.signup_input_text} ${emailValidate ? '' : signupStyle.validateErr} btrr`}
            placeholder='이메일'
            autoComplete='off'
            required
            onChange={(e) => {
              setEmail(e.target.value);
              emailCheck(e.target.value);
            }}></input>
        </div>
        <div className={signupStyle.signup_input_div}>
          <div className={`${signupStyle.signup_emoji} ${passwordValidate ? '' : signupStyle.validateErr}`}>
            <i className='fa-solid fa-lock'></i>
          </div>
          <input
            type='password'
            value={password}
            className={`${signupStyle.signup_input_text} ${passwordValidate ? '' : signupStyle.validateErr}`}
            placeholder='비밀번호'
            required
            autoComplete='off'
            onChange={(e) => {
              setPassword(e.target.value);
              passwordCheck(e.target.value);
            }}></input>
        </div>
        <div className={signupStyle.signup_input_div}>
          <div className={`${signupStyle.signup_emoji} ${pwDoubleValidate ? '' : signupStyle.validateErr}`}>
            <i className='fa-solid fa-check'></i>
          </div>
          <input
            type='password'
            value={pwDoubleCheckText}
            className={`${signupStyle.signup_input_text} ${pwDoubleValidate ? '' : signupStyle.validateErr}`}
            placeholder='비밀번호 확인'
            required
            autoComplete='off'
            onChange={(e) => {
              setPwDoubleCheckText(e.target.value);
              passwordDoubleCheck(e.target.value);
            }}></input>
        </div>
        <div className={`${signupStyle.signup_input_div} mb10`}>
          <div className={`${signupStyle.signup_emoji} ${nicknameValidate ? '' : signupStyle.validateErr} bb bblr`}>
            <i className={'fa-solid fa-user'}></i>
          </div>
          <input
            type='text'
            value={nickname}
            className={`${signupStyle.signup_input_text} ${nicknameValidate ? '' : signupStyle.validateErr} bb bbrr`}
            maxLength={20}
            placeholder='닉네임'
            required
            autoComplete='off'
            onChange={(e) => {
              setNickname(e.target.value);
              nicknameCheck(e.target.value);
            }}></input>
        </div>
        <div className={`emailErrMsg ${signupStyle.validateErrMsg}`}></div>
        <div className={`passwordErrMsg ${signupStyle.validateErrMsg}`}></div>
        <div className={`pwDobleCheckErrMsg ${signupStyle.validateErrMsg}`}></div>
        <div className={`nicknameErrMsg ${signupStyle.validateErrMsg}`}></div>
        <button
          type='submit'
          className={signupStyle.signup_btn}>
          가입하기
        </button>
      </form>
      <Snackbar
        open={showNoti}
        message='회원가입이 완료되었습니다.'
        onClose={closeNoti}
        action={
          <React.Fragment>
            <Button
              color='primary'
              size='small'
              onClick={closeNoti}>
              확인
            </Button>
          </React.Fragment>
        }
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}></Snackbar>
    </div>
  );
};

export default Signup;
