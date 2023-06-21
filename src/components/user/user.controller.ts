import { IUser, IUserLogIn, IUserSelect, IuserUpdate } from './user.interface';
import { Request, Response } from "express";
import UserService from "./user.service";

    class UserController {
        constructor(private readonly userService:UserService = new UserService()){}

        getUser = async (req: Request, res: Response): Promise<any> =>{
            try{
                const users =await this.userService.getUsers();
                res.status(200).send(users);
            }catch(err){
                res.status(400).send(`[User-manegement] Controller : cann't get users ${err}`);
            }
        };

        createUser = async (req: Request, res: Response): Promise<any> => {
            const user:IUser = req.body;
            try{
                const userExist = await this.userService.getUserByEmail(user.email);
                if(!userExist.user.length){
                    const key = await this.userService.createUser(user);
                    res.status(201).send(key);
                }else{
                    res.status(409).send(`[User-magement] Controller : cann't create user, user already exist`);
                }
                
            }catch(err){
                res.status(400).send(`[User-magement] Controller : cann't create user ${err}`);
            }
        }

        updateUser = async (req: Request, res: Response): Promise<void> => {
            const user:IuserUpdate = req.body;
            try{
                await this.userService.updateUser(user);
                res.status(200).send();
            }catch(err){
                res.status(400).send(`[User-magement] Controller : cann't update user ${err}`);
            }
        }

        getUserByKey = async (req: Request, res: Response): Promise<any> => {
            try{
                const key:any = req.params;
                const user:IUserSelect[] | {} = await this.userService.getUserByKey(key);
                res.status(200).send(user);
            }catch(err){
                res.status(400).send(`[User-magement] Controller : cann't find user ${err}`);
            }
        }

        deleteUser = async (req: Request, res: Response): Promise<void> => {
            try{
                const key:any = req.params;
                const userExist = await this.userService.getUserByKey(key);
                if(!userExist.length){
                    await this.userService.deleteUser(key);
                    res.status(200).send();
                }else{
                    res.status(409).send(`[User-magement] Controller : cann't delete user, user doesn't exist`);
                }
            }catch(err){
                res.status(400).send(`[User-magement] Controller : cann't delete user ${err}`);
            }
        }
        
        login = async (req: Request, res: Response): Promise<void> => {
            const user:IUserLogIn = req.body;
            try{
                const userExist = await this.userService.getUserByEmail(user.email);
                if(userExist.user.length){
                    const token = await this.userService.logIn(user);
                    res.status(201).send(token)
                }else{
                    res.status(409).send(`[User-magement] Controller : cann't find user, user doesn't exist`);
                }
            }catch(err){
                res.status(400).send(`[User-magement] Controller : cann't login ${err}`);
            }
        }
    }

export default new UserController();
    
    
