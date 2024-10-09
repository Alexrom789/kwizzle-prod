"use client";
import UserForm from "@/components/UserForm";
import React, { useEffect, useState } from "react";
import DataTableSimple from "./data-table-simple";

import axios from "axios";
import { User } from "@prisma/client";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserSubmit = async (newUser: User) => {
    setUsers((prev) => [...prev, newUser]);
  };

  return (
    <div>
      <h1>User Management</h1>
      <UserForm onUserSubmit={handleUserSubmit} />
      {isLoading ? <p>Loading users...</p> : <DataTableSimple users={users} />}
    </div>
  );
};

export default Users;
