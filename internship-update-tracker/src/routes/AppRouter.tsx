import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Loader from "../components/common/Loader";

const Login = lazy(() => import("../pages/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const UpdateDetail = lazy(() => import("../pages/UpdateDetail"));
const NotFound = lazy(() => import("../pages/NotFound"));
const ErrorPage = lazy(() => import("../pages/ErrorPage"));

const AppRouter: React.FC = () => {
    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                {/* ✅ ENTRY POINT */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/login" element={<Login />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/update/:id"
                    element={
                        <ProtectedRoute>
                            <UpdateDetail />
                        </ProtectedRoute>
                    }
                />

                <Route path="/error" element={<ErrorPage />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};

export default AppRouter;
