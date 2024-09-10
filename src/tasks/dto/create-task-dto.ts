import { IsNotEmpty } from 'class-validator';
export class CreateTaskDto {
  @IsNotEmpty()
  taskTitle: string;
  @IsNotEmpty()
  taskDescription: string;
  
}
