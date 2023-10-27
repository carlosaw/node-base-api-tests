import { User, UserInstance } from '../models/User';
import * as UserService from './UserService';

let email = 'test@jest.com';
let password = '1234';

describe('Testing user service', () => {

  beforeAll(async () => {
    await User.sync({ force: true });
  });

  // Ver se criou novo usuário
  it('should create a new user', async () => {
    const newUser = await UserService.createUser(email, password) as UserInstance;
    expect(newUser).not.toBeInstanceOf(Error);
    expect(newUser).toHaveProperty('id');
    expect(newUser.email).toBe(email);
  });

  // Não pode criar usuário com mesmo email
  it('should not allow to create a user with existing email', async () => {
    const newUser = await UserService.createUser(email, password);
    expect(newUser).toBeInstanceOf(Error);    
  });

  // Procurar usuário pelo email
  it('should find a user by the email', async () => {
    const user = await UserService.findByEmail(email) as UserInstance; 
    expect(user.email).toBe(email);
  });

  // Verificar se a senha bate
  it('should match the password from database', async () => {
    const user = await UserService.findByEmail(email) as UserInstance;
    const match = UserService.matchPassword(password, user.password);
    expect(match).toBeTruthy();
  });
  // Verificar se senha não bate
  it('should not match the password from database', async () => {
    const user = await UserService.findByEmail(email) as UserInstance;
    const match = UserService.matchPassword('invalid', user.password);
    expect(match).toBeFalsy();
  });

  // Lista de usuários
  it('should get a list of users', async() => {
    const users = await UserService.all();
    expect(users.length).toBeGreaterThanOrEqual(1);
    for(let i in users) {
      expect(users[i]).toBeInstanceOf(User);
    }
  });
});