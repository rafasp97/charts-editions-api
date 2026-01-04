import { BadRequestException } from "@nestjs/common";

export class StandardUsers {

    static edition: string[] = [
        'iraaaph', 
        'guswlima', 
        'piscixxx', 
        'erikbzra', 
        'candygor', 
        'llucasmoreno5', 
        'brunocosta061', 
        'akumakoji', 
        'becamusics',
        'Edu_XS',
        'felipetas',
        'vitoriaforttes',
        'iigorsolv',
        'cocodilhaatomic'
    ];

    static getUsersByGroup(group: string): string[] {
        const users = (StandardUsers as any)[group];
        if (!users) throw new BadRequestException('Grupo não encontrado');
        return users;
    }
}
