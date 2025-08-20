'use client';

import LoginPage from "./auth/auth";
import { Utils } from "./constants/utils";


export default function Page() {
  return (
    <Utils>
      <LoginPage />
    </Utils>
  );
}