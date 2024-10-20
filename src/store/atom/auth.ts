// 로그인 상태 atom 관리

import {atom} from 'jotai';
import {IUserInfo} from '../../interface/interface';

export const isLoggedInAtom = atom<boolean>(false);

export const userAtom = atom<IUserInfo>();
