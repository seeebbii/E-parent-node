export class Utils{

    static getAge(dateOfBirth: any): number{
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
    
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
    
        return age;
    
    }

    static formatNotificationMessage(title: String, subtitle: String): any {
      return {
        notification: {
          title: title,
          body: subtitle
        }
      };
    }

}
