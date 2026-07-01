import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

// hooks.ts makes Redux easier and safer to use in React components with TypeScript
 
// to use redux just use 
// import { useAppDispatch, useAppSelector } from "../store/hooks";