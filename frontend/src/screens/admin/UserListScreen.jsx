import { useSelector } from 'react-redux';
import { Button, Container, Table, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { FaTimes, FaCheck, FaEdit, FaTrash } from 'react-icons/fa';
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';

const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  // const [createProduct, { isLoading: loadingCreate }] =
  //   useCreateProductMutation();
  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const auth = useSelector((state) => state.auth);
  const { userInfo } = auth;

  const deleteHandler = async (userId) => {
    if (window.confirm('Are you sure to delete user?')) {
      try {
        const res = await deleteUser(userId);
        refetch();
        toast.success(res.message);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message>{error?.data?.message}</Message>
      ) : (
        <Table striped hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
            </tr>
          </thead>
          <tbody>
            {userInfo &&
              userInfo.isAdmin &&
              users &&
              users.map((user) => {
                return (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.isAdmin ? (
                        <FaCheck style={{ color: 'green' }} />
                      ) : (
                        <FaTimes style={{ color: 'red' }} />
                      )}
                    </td>
                    <td>
                      {!user.isAdmin && (
                        <>
                          <LinkContainer to={`/admin/user/${user._id}/edit`}>
                            <Button variant='light' className='btn-sm mx-2'>
                              <FaEdit />
                            </Button>
                          </LinkContainer>

                          <Button
                            variant='danger'
                            className='btn-sm'
                            onClick={() => deleteHandler(user._id)}
                          >
                            <FaTrash style={{ color: 'white' }} />
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      )}
    </>
  );
};
export default UserListScreen;
