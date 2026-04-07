import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject} from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, throwError, timeout } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ChartService {

    base_url = environment.baseUrl;


/*************************  Popular instance   *******************************/
     //  base_url = "https://popular-api.syntheta.net:8443"


 //////////////////// testing kalyan api 
//base_urlOld = "https://testing-api.idamtat.in"
  //  base_url = "https://kalyan-reports-api.idamtat.in"


/************************* live baseUrl ********************e***********/
 //  base_url  =  "https://api.syntheta.net";


/************************* Kalyan idamtat url *******************************/
        // base_url = "https://kal-api.idamtat.in:8445"
   //   base_url = "https://kal-api.idamtat.in"


/************************* lenovo url *******************************/
  //old one base_url = "https://tstapi-lenovo.syntheta.net"
  // base_url = "https://lenovo-api.syntheta.net"

 

/************************* Asteya url *******************************/
  //base_url = "https://asteya-api.syntheta.net"


/************************* Winzo url *******************************/
  // base_url = "https://winzogm-api.syntheta.net"


/************************* Kues url *******************************/
   //base_url = "https://keus-api.syntheta.net"

/************************ Kalyani motors url ********************************* */

  //  base_url = "https://kalyani-api.syntheta.net"

  /////////////////////////  transconn ////////////////

  //  base_url = "https://trasccon-api.syntheta.net"


  


  private readonly httpClient = inject(HttpClient);


    // swagger apis //////////
  objectPivotCreate(obj : any):Observable<any>{
     
       let url =  `${this.base_url}/dashboard-objects/get-data-for-dashboard-object`;
       const timeoutValue = 60000 * 3;

      //  return this.httpClient.post(url, obj).pipe(
      //    timeout(timeoutValue),
      //    catchError((error: any) => {
      //      console.error('HTTP request timed out or encountered an error:', error);
      //      // Handle timeout or other errors here
      //      return throwError(() => error);
      //    })
      //  );
      return this.httpClient.post(url, obj)
    }
  
    public execute(state: any): void {
      // this.getData(state).subscribe((x) => super.next(x));
    }

    getDashboardDataWithFilterById(dashboard_id : any, obj : any):Observable<any>{
      let url =  `${this.base_url}/get-dashboard-data-with-filter-by-id/${dashboard_id}`;
      return this.httpClient.post(url, obj)
    }
    getDashboardDataWithFilterByIdWithState(dashboard_id : any, obj : any):Observable<any>{
      let url =  `${this.base_url}/get-dashboard-data-with-filter-by-id/${dashboard_id}`;
      return this.httpClient.post(url, obj)
    }



    // getDashboardDataWithBookmarkFilterById(dashboard_id : any, obj : any):Observable<any>{
    //   let url =  `${this.base_url}/get-dashboard-data-with-bookmark-filters-by-id/${dashboard_id}`;
    //   return this.httpClient.get(url, obj)
    // }
    getDashboardDataWithBookmarkFilterById(dashboard_id : any, obj : any, is_initial_load:boolean, is_default_bookmark_filter:boolean):Observable<any>{
      let url =  `${this.base_url}/get-dashboard-data-with-bookmark-filters-by-id/${dashboard_id }/${is_initial_load}/${is_default_bookmark_filter}`;
      return this.httpClient.get(url, obj)
    }

    editDashboardDetailsWithBookmarkFilterById(dashboard_id : any, obj : any, is_initial_load:boolean, is_default_bookmark_filter:boolean):Observable<any>{
      let url =  `${this.base_url}/get-dashboard-edit-data-with-bookmark-filters-by-id/${dashboard_id }/${is_initial_load}/${is_default_bookmark_filter}`;
      return this.httpClient.get(url, obj)
    }


    createBookmarkFilterById(dashboard_id : any, is_default_bookmark_filter : any, obj : any){
      //https://api.syntheta.net/create-bookmark-filters-by-id/1/true
      let url =  `${this.base_url}/create-bookmark-filters-by-id/${dashboard_id}/${is_default_bookmark_filter}`;
      return this.httpClient.post(url, obj)
    }


    deleteDashboardDataWithBookmarkFilterById(dashboard_id : any, is_default_bookmark_filter : boolean):Observable<any>{
      let url =  `${this.base_url}/clear-bookmark-filters-by-id/${dashboard_id}/${is_default_bookmark_filter}`;
      return this.httpClient.delete(url)
    }

    updateDashboardDetails(obj : any){

      // https://api.syntheta.net/dashboards/update-dashboard-details

      let url =  `${this.base_url}/dashboards/update-dashboard-details`;
      return this.httpClient.post(url, obj)

    }

   


    //https://api.syntheta.net/clear-bookmark-filters-by-id/1/true
    getDashboardDataByIdWithoutData(dashboard_id : any){
      let url = `${this.base_url}/dashboards/get-dashboard-detail-by-id/${dashboard_id}`;
      return this.httpClient.get(url)
    }
    getTableNamesArrary(connection_id : any):Observable<any>{
      let url = `${this.base_url}/table-details/get-table-names/${connection_id}`; 
       
      return this.httpClient.get(url)
    }


    getColumnNameBYTableName(tableName: string, connection_id : any):Observable<any> {
      
      const url = `${this.base_url}/table-details/get-column-names/${connection_id}?table_or_view_name=${tableName}`;  
      return this.httpClient.get(url);
    }
    
    getAllDashboardDetails():Observable<any>{
      //http://164.52.217.212:8082/get-all-dashboards-details
      
      const url = `${this.base_url}/get-all-dashboards-details`;  
      return this.httpClient.get(url);
    }

    // getAllDashboardDetailsWithEmptyData():Observable<any>{
    //   //http://164.52.217.212:8082/get-all-dashboards-details
      
    //   const url = `${this.base_url}/get-dashboard-list`;  
    //   return this.httpClient.get(url);
    // }

    


    postDashboardCreationObj(obj : any):Observable<any>{
      
      const url = `${this.base_url}/dashboards`;  
      return this.httpClient.post(url, obj);
    }
    getDashboardById(dashboard_id : any):Observable<any>{
 
      const url = `${this.base_url}/dashboards/${dashboard_id}`;  
      return this.httpClient.get(url);
    }
    getDashboardImageById(dashboard_id:any):Observable<any>{
      const url = `${this.base_url}/dashboards/image/${dashboard_id}`;  
      return this.httpClient.get(url);
    }
    getDashboardByDashboardName(dashboard_name : string){
      //dashboards/get-dashboard-detail-by-name
      const url = `${this.base_url}/dashboards/get-dashboard-detail-by-name/${dashboard_name}`;  
      return this.httpClient.get(url);
    }
    updateDashboardById(id : any, obj : any):Observable<any>{
      // const url = `${this.base_url}/dashboards/dashboard-update?dashboard_id=${id}`; 
      const url = `${this.base_url}/dashboards/dashboard-update/${id}`;  
      return this.httpClient.put(url, obj);
    }

    deleteDashboardById(id : string):Observable<any>{
      // http://164.52.217.212:8082/dashboards/dashboard-delete/11
      // const url = `${this.base_url}/dashboards/dashboard-delete?dashboard_id=${id}`;  
      const url = `${this.base_url}/dashboards/dashboard-delete/${id}`;  
      return this.httpClient.delete(url);
    }

    getDashboardDetailsById(id : any):Observable<any>{
     // http://164.52.217.212:8082/dashboards/get-dashboard-detail-by-id/one
      // const url = `${this.base_url}/dashboards/get-dashboard-detail-by-id?dashboard_id=${id}`;
      // https://api.syntheta.net/dashboards/get-dashboard-detail-by-id  
      const url = `${this.base_url}/dashboards/get-dashboard-detail-by-id/${id}`;  
      return this.httpClient.get(url);
    }


    updateDashboardIndexs(obj : any){
      let url = `${this.base_url}/update-dashboard-index`;
      return this.httpClient.put(url, obj)
    }

    getAllDashboardDetailsWithEmptyData():Observable<any>{
      //http://164.52.217.212:8082/get-all-dashboards-details
      
      // const url = `${this.base_url}/get-dashboard-list`;  
     // const url = `${this.base_url}/get-all-dashboards-details-list`;
       const url = `${this.base_url}/get-all-dashboards-list-new`;
      return this.httpClient.get(url);
    }

    /*******************  Table Pagination Api *******************/

    // /table-pagination-by-page-number/{dashboard_id}/{panel_id}/{level}
//  /table-pagination-by-items-per-page/{dashboard_id}/{panel_id}/{level}

    getTablePaginationByPageNumber(dashboard_id : string, panel_id : string, obj : any, level : any){
      const url = `${this.base_url}/table-pagination-by-page-number/${dashboard_id}/${panel_id}/${level}`;  
      return this.httpClient.post( url ,obj);
    }

    // public getTablePaginationByPageNumber(dashboard_id: string, panel_id: string, obj: any): Observable<any> {
    //   const url = `${this.base_url}/table-pagination-by-page-number/${dashboard_id}/${panel_id}`;
    //   return this.httpClient.post(url, obj)
    //     .pipe(
    //       map((res : any) =>{
    //         console.log(res)
    //       })
    //     );
    // }

    getTablePaginationByItemPerPage(dashboard_id : string, panel_id : string, obj : any, level : any){
      const url = `${this.base_url}/table-pagination-by-items-per-page/${dashboard_id}/${panel_id}/${level}`;  
      return this.httpClient.post( url ,obj);
    }

    /*******************  Users Api *******************/

    /* Register user*/
    registerUser(obj : any):Observable<any>{
      const url = `${this.base_url}/register-user`;  
      return this.httpClient.post(url, obj);
    }

    getAllUsersDetails():Observable<any>{
      const url = `${this.base_url}/users/get-all-users-details`;
      return this.httpClient.get(url)
    }
    
    getUserDetailsById(user_id : any):Observable<any>{
      const url = `${this.base_url}/get-user-details-by-id/${user_id}`;
      return this.httpClient.get(url)
    }
    getallActiveUserDetails(){
      const url = `${this.base_url}/users/get-all-active-users-details`;
      return this.httpClient.get(url)
    }
    getUserDetailByUsername(username : string):Observable<any>{
      
      const url = `${this.base_url}/users/get-user-detail-by-username/${username}`;
      return this.httpClient.get(url)
    }

    getUserDetailbyEmail(email : string){
      const url = `${this.base_url}/users/get-user-details-by-email/${email}`;

    
      return this.httpClient.get(url)
    }

    

    updateUserByUserName(username : string,  obj : any):Observable<any>{
      const url = `${this.base_url}/users/update-user/${username}`;
      return this.httpClient.put(url, obj)
    }
    updateUserById(id : any,  obj : any):Observable<any>{
      const url = `${this.base_url}/users/update-user/${id}`;
      return this.httpClient.put(url, obj)
    }
    ResetPassword(user_id : any,  obj : any):Observable<any>{
      const url = `${this.base_url}/users/reset-user-password/${user_id}`;
      return this.httpClient.put(url, obj)
    }

    
    
    deleteUserByUsername(username : string):Observable<any>{
      const url = `${this.base_url}/users/delete-user/${username}`;
      return this.httpClient.delete(url)
    }

    deleteUserByUserId(id : number){
      const url = `${this.base_url}/users/delete-user/${id}`;
      return this.httpClient.delete(url)
    }

    /*******************  Roles Api *******************/

    createRole(obj : any):Observable<any>{
      const url = `${this.base_url}/roles`;  
      return this.httpClient.post(url, obj);
    }

    getAllRolesDetails():Observable<any>{
      const url = `${this.base_url}/roles/get-all-roles-details`;
      return this.httpClient.get(url)
    }
    
    getAllActiveRoleDetails():Observable<any>{
      const url = `${this.base_url}/get-all-active-roles`;
      return this.httpClient.get(url)
    }

    getRoleDetailsByRolename(rolename : string):Observable<any>{
      const url = `${this.base_url}/roles/get-role-detail/${rolename}`;
      return this.httpClient.get(url)
    }

    updateRoleByRolename(rolename : string, obj : any):Observable<any>{
      // https://api.syntheta.net/roles/update-role/intern
      const url = `${this.base_url}/roles/update-role/${rolename}`;
      return this.httpClient.put(url, obj)
    }
    updateRoleById(id : any , obj : any){
      const url = `${this.base_url}/roles/update-role/${id}`;
      return this.httpClient.put(url, obj)
    }

    deleteRolebyRolename(rolename : string):Observable<any>{
      const url = `${this.base_url}/roles/delete-role/${rolename}`;
      return this.httpClient.delete(url)
    }

    deleteRoleById(id : number){
      const url = `${this.base_url}/roles/delete-role/${id}`;
      return this.httpClient.delete(url)
    }
    /***********************  Database connection api   ******************************** */

    createDatabase(obj : any):Observable<any>{
      const url = `${this.base_url}/connection/create-db-connection`;
      return this.httpClient.post(url, obj)
    }

    getDbConnection(){

    }
    getAllActiveDbConnectionDetails():Observable<any>{
      const url = `${this.base_url}/connection/get-all-active-db-connection-details`;
      return this.httpClient.get(url)
    }

    getAllDbConncetionDetails():Observable<any>{
      const url = `${this.base_url}/connection/get-all-db-connection-details`;
      return this.httpClient.get(url)
    }
    
    getDbConnectionDetailById(connection_id : any):Observable<any>{
      const url = `${this.base_url}/connection/get-db-connection-details-by-id/${connection_id}`;
      return this.httpClient.get(url)
    }

    testDbConnection(obj : any):Observable<any>{
      const url = `${this.base_url}/connection/test-db-connection`;
      return this.httpClient.post(url, obj)
    }

    activateDBConnection(connection_id : any):Observable<any>{
      const url = `${this.base_url}/connection/activate-db-connection/${connection_id}`;
      return this.httpClient.get(url)
    }

    deActivateDBConnection(connection_id : any):Observable<any>{
      const url = `${this.base_url}/connection/deactivate-db-connection/${connection_id}`;
      return this.httpClient.get(url)
    }
    
    updateDbConnection(id : any, obj : any):Observable<any>{
      const url = `${this.base_url}/connection/update-db-connection/${id}`;
      return this.httpClient.put(url, obj)
    }
    
    deleteDBConnection(id : any):Observable<any>{
      const url = `${this.base_url}/connection/delete-db-connection/${id}`;
      return this.httpClient.delete(url)
    }


    getAllDatabaseNameById(id : any):Observable<any>{
      const url = `${this.base_url}/connection/get-all-database-names-by-id/${id}`;
      return this.httpClient.get(url)
    }


    /************************* Login API ****************************** */

    loginUser(obj : any):Observable<any>{
      let url =`${this.base_url}/login-user`;
      return this.httpClient.post(url, obj)
    }

    /**************************  Access for Apis  ***************************** */






    /**************************  User Based Access  ***************************** */
    createUserBaseAccess(obj : any):Observable<any>{
      let url =`${this.base_url}/create-user-permission`;
      return this.httpClient.post(url, obj)
    }

    getUserBasePermissionByUserId(user_id : any){
      
      let url = `${this.base_url}/get-user-permission-by-id/${user_id}`;
      return this.httpClient.get(url)
    }
    
    getUserPermissionByRoleIdUserId(role_id : number, user_id : number){
      let url = `${this.base_url}/get-user-permission-by-roleid-userid/${role_id}/${user_id}`;
      return this.httpClient.get(url)
    }

    geAlltUserBasedAccess():Observable<any>{
      let url =`${this.base_url}/get-all-user-permissions`;
      return this.httpClient.get(url)
    }

    updateUserBasedAccess(id :number, obj : any):Observable<any>{
      let url =`${this.base_url}/update-user-permission/${id}`;
      return this.httpClient.put(url, obj)
    }
    deleteUserBasedAccess(id :number):Observable<any>{
      let url =`${this.base_url}/delete-user-permission/${id}`;
      return this.httpClient.delete(url)
    }

    /**************************  Role Based Accessed  ***************************** */
    createRoleBaseAcess(obj : any):Observable<any>{
      // let url =`${this.base_url}/create-role-based-access`;
      let url =`${this.base_url}/create-role-permission`;
      
      return this.httpClient.post(url, obj)
    }

    getroleBasedAccessById(id : any):Observable<any>{
      let url =`${this.base_url}/get-role-permission-by-id/${id}`;
      return this.httpClient.get(url)
    }

    getroleBasedPermissionByroleId(role_id : any):Observable<any>{
      let url =`${this.base_url}/get-role-permission-by-roleid/${role_id}`;
      return this.httpClient.get(url)
    }


    getAllRoleBasedAccessDetails(){
      let url = `${this.base_url}/get-all-role-permissions`;
      return this.httpClient.get(url)

    }
    updateroleBasedAccess(id :any, obj : any):Observable<any>{
      let url =`${this.base_url}/update-role-permission/${id}`;
      return this.httpClient.put(url, obj)
    }
    
    deleteroleBasedAccess(id :any):Observable<any>{
      let url =`${this.base_url}/delete-role-permission/${id}`;
      return this.httpClient.delete(url)
    }

    /**************************  Role Based Dashboard Accessed  ***************************** */
    createRoleBaseDashboardAccess(obj : any):Observable<any>{
      let url =`${this.base_url}/create-role-dashboard-permission`;
      return this.httpClient.post(url, obj)
    }

    getAllRoleDashboardPermissionById(id : number){
      let url = `${this.base_url}/get-all-role-dashboard-permissions-by-id/${id}`;
      return this.httpClient.get(url)
    }

    getAllRoleDashboardPermissionByRoleid(role_id : number){
      //get-all-role-dashboard-permissions-by-roleid

      let url = `${this.base_url}/get-all-role-dashboard-permissions-by-roleid/${role_id}`;
      return this.httpClient.get(url)
    }

    // getroleBasedDashboardAccessByRoleId(id : any):Observable<any>{
    //   //get-role-dashboard-permission-by-roleid
    //   let url =`${this.base_url}/get-role-dashboard-permission-by-id/${id}`;
    //   return this.httpClient.get(url)
    // }

    getRolebasedDashboardPermssionByRoleId(role_id : number , id : number){
      let url =`${this.base_url}/get-role-dashboard-permission-by-roleid/${role_id}/${id}`;
      return this.httpClient.get(url)
    }

    getAllRoleBasedDashboardAccess(){
      let url =`${this.base_url}/get-all-role-dashboard-permission-details`;
      return this.httpClient.get(url)
    }
    updateroleBasedDashboardAccess(id :any, obj : any):Observable<any>{
        // let url =`${this.base_url}/update-role-dashoard-permission/${id}`;
        let url =`${this.base_url}/update-role-dashboard-permission/${id}`;
      
      return this.httpClient.put(url, obj)
    }
    deleteroleBasedDashboardAccess(id :any):Observable<any>{
      let url =`${this.base_url}/delete-all-role-dashboard-permissions/${id}`;
      return this.httpClient.delete(url)
    }

    deleteRoleIdBasedDashboardAceessByRoleId(role_id : number, id : number){
      let url = `${this.base_url}/delete-role-dashboard-permission-by-id/${role_id}/${id}`;
      return this.httpClient.delete(url)
    }




    /**************************  User Based Dashboard Accessed  ***************************** */

    createUserBaseDashboardAcess(obj : any):Observable<any>{
      let url =`${this.base_url}/create-user-dashboard-permission`;
      return this.httpClient.post(url, obj)
    }

    getAllUserPermissionById(id : any){

      //get-all-user-dashboard-permissions-by-id

      let url =`${this.base_url}/get-all-user-dashboard-permissions-by-id/${id}`;
      return this.httpClient.get(url)
    }

    getAllUserDashboardPermissionByRoleidUserId(role_id : number, user_id:number){
      // get-all-user-dashboard-permission-by-roleid-userid

      let url =`${this.base_url}/get-all-user-dashboard-permission-by-roleid-userid/${role_id}/${user_id}`;
      return this.httpClient.get(url)

    }


    getUserDashboardPermissionByRoleidUseridId(role_id : number, user_id:number, id : number){
      // get-all-user-dashboard-permission-by-roleid-userid

      let url =`${this.base_url}/get-user-dashboard-permission-by-roleid-userid/${role_id}/${user_id}`;
      return this.httpClient.get(url)

    }

    getuserBasedDashboardAccessByUserId(id : any):Observable<any>{
      
      let url =`${this.base_url}/get-user-dashboard-permission-by-id/${id}`;
      return this.httpClient.get(url)
    }
    getAllUserBasedDashboardPermission(){
      let url = `${this.base_url}/get-all-user-dashboard-permission-details`;
      return this.httpClient.get(url)
    }

    updateuserBasedDashboardAccess(id :any, obj : any):Observable<any>{
      let url =`${this.base_url}/update-user-dashboard-permission/${id}`;
      return this.httpClient.put(url, obj)
    }
    deleteuserBasedDashboardAccess(id :any):Observable<any>{
      let url =`${this.base_url}/delete-user-dashboard-permission/${id}`;
      return this.httpClient.delete(url)
    }
    deleteDashboardPermissionByRoleUserId(role_id : number, user_id : number){
      let url =`${this.base_url}/delete-user-dashboard-permission/${role_id}/${user_id}`;
      return this.httpClient.delete(url)
    }

    deleteDashboardPermissionByRoleUserPermissionId(role_id : number, user_id : number, id : number){
      let url =`${this.base_url}/delete-user-dashboard-permission-by-id/${role_id}/${user_id}/${id}`;
      return this.httpClient.delete(url)
    }


    /**************************  Upload File Api  ***************************** */


    uploadFileApi(obj : any):Observable<any>{
      let url =`${this.base_url}/upload-files`;
      return this.httpClient.post(url, obj)
    }

    getTableNameForInternalData(connection_id : any){
      let url =`${this.base_url}/table-details/get-internal-table-names/?connection_id=${connection_id}`;
      return this.httpClient.get(url)
    }



    private titleSubject = new BehaviorSubject<string>('');
    public title$ = this.titleSubject.asObservable();
  
    setTitle(title: string) {
      this.titleSubject.next(title);
    }

    


    /**************************  Table Join Api  ***************************** */


    createTableJoin(obj : any):Observable<any>{
      let url =`${this.base_url}/joins/create-join`;
      return this.httpClient.post(url, obj)
    }

    getAllTableJoins():Observable<any>{
      let url =`${this.base_url}/joins/get-all-joins`;
      return this.httpClient.get(url)
    }

    getAllActiveTableJoin():Observable<any>{      
      let url =`${this.base_url}/joins/get-all-active-joins`;
      return this.httpClient.get(url)

    }

    getJoinDetailsByJoinId(join_id : number){
      let url =`${this.base_url}/joins/get-join-details-by-id/${join_id}`;
      return this.httpClient.get(url)
    }

    getJoinDetailsByJoinName(join_name : string){
      let url =`${this.base_url}/joins/get-join-details-by-name/${join_name}`;
      return this.httpClient.get(url)
    }

    updateJoinDetailByJoinId(join_id : number, obj : any){
      let url = `${this.base_url}/joins/update-join/${join_id}`;
      return this.httpClient.put(url, obj)
    }

    deleteTableJoinDetial(join_id : number){
      let url = `${this.base_url}/joins/delete-join/${join_id}`;
      return this.httpClient.delete(url)
    }


    /**************************  Table Export Upload  ***************************** */

    downloadTableExportExcel(dashboard_id : string, panel_id : string, obj : any, level : number){
      // let url = `${this.base_url}/table-export-with-filters/${dashboard_id}/${panel_id}`;
      let url = `${this.base_url}/table-export-with-filters/${dashboard_id}/${panel_id}/${level}`;
      
      return this.httpClient.post(url, obj)
    }


    /**************************  Cache delete api  ***************************** */

    getAllCacheKeys(){
      let url = `${this.base_url}/get-all-keys`
      return this.httpClient.get(url)
    }

    deleteAllCache(){
      let url = `${this.base_url}/all-cache-delete`;
      return this.httpClient.delete(url)

    }

    deleteDashboardCache(dashboard_id : string){
      // let url = `${this.base_url}/unit-delete-cache?dashboard_id=${dashboard_id}`;
      let url = `${this.base_url}/unit-delete-cache/${dashboard_id}`;
      return this.httpClient.delete(url)
    }
   

    /**************************  Dashboard Setup api  ***************************** */


    getAllDashboardSetups(){
      let url = `${this.base_url}/ get-all-dashboard-setup-details`;
      return this.httpClient.get(url)
    }

    createDashboardSetup(obj : any){
      let url = `${this.base_url}/create-dashboard-setup`;
      return this.httpClient.post(url, obj)
    }

    updateDashboardSetup( id : number, obj : any){
      let url = `${this.base_url}/update-dashboard-setup/${id}`;
      return this.httpClient.put(url, obj)
    }

    
    getDashboardSetupById(id : any){
      let url = `${this.base_url}/get-dashboard_setup-details-by-id/${id}`;
      return this.httpClient.get(url)
    }

    getDashboardSetupByUserId(id : any){
      let url = `${this.base_url}/get-dashboard_setup-details-by-userid/${id}`;
      return this.httpClient.get(url)
    }

    deleteDashboardSetupById(id : any){
      let url = `${this.base_url}/delete-dashboard-setup/${id}`;
      return this.httpClient.delete(url)
    }


    // download db config file api

    getDbFilewithData(){
      let url = `${this.base_url}/download-db-file-with-data`;
      // return this.httpClient.get(url)
      return this.httpClient.get(url, { responseType: 'blob' });
    }
    getDbFileWithoutData(){
      let url = `${this.base_url}/download-empty-db-file`;
      // return this.httpClient.get(url)
      return this.httpClient.get(url, { responseType: 'blob' });

    }


    /////////// Users upload ////////////////////
   


    uploadBulkUsers(obj : any){
      let url = `${this.base_url}/users_upload/`;
      return this.httpClient.post(url, obj);

    }

    updateBulkUsers(obj : any){
      // https://demo-api.syntheta.net/bulk-users-update/
      let url = `${this.base_url}/bulk-users-update/`; 
      return this.httpClient.post(url, obj);
    }
    
    /**************************  Download Dump Reports ***************************** */



    downloadDumpReportsOld(dashboard_id : string, panel_id : string, obj : any){
      let url = `${this.base_url}/get-raw-data-dump-by-id/${dashboard_id}/${panel_id}`;
      return this.httpClient.post(url, obj)
    }

    // downloadDumpReports(dashboard_id: string, panel_id: string, obj: any) {
    //   const url = `${this.base_url}/get-raw-data-dump-by-id/${dashboard_id}/${panel_id}`;
    //   return this.httpClient.post(url, obj, { responseType: 'blob' }); // Ensure blob type
    // }

    downloadDumpReports(dashboard_id: string, panel_id: string, obj: any) {
      const url = `${this.base_url}/get-raw-data-dump-by-id/${dashboard_id}/${panel_id}`;
      return this.httpClient.post(url, obj, {
        responseType: 'blob',
        observe: 'response'
      });
    }

    

    

   /************************** Orgnization data ***************************** */


   getOrgnizationData(app_url : string){
          let url = `${this.base_url}/get-organisation-details/${app_url}`;
          return this.httpClient.get(url)
   }

  /************************ Azure ID Api ************************************** */

  
  // https://demo-api.syntheta.net/auth/callback
  azureLoginUser(obj : any):Observable<any>{
    let url =`${this.base_url}/auth/callback`;
    return this.httpClient.post(url, obj)
  }


  /************************ Login Track details api  ************************************** */


  loginTrackSubmit(obj : any):Observable<any>{
    let url =`${this.base_url}/track-login-details/`;
    // https://demo-api.syntheta.net/track-login-details/
    return this.httpClient.post(url, obj)
  }

  
  DashboardTrackSubmit(obj : any):Observable<any>{
    let url =`${this.base_url}/track-dashboard-view-details/`;
    // https://demo-api.syntheta.net/track-dashboard-view-details/
    return this.httpClient.post(url, obj)
  }

  trackThunderaDetails(obj : any):Observable<any>{
    let url =`${this.base_url}/thunder-usage-track/`;  
    return this.httpClient.post(url, obj)
  }










   // api for htmlTextViewer 

  //  createHTMLViewer(obj : any):any{
  //   // let url = "https://automate.suryojasvi.com/webhook/1e408f28-08aa-457d-b7b4-6a60b2f1c505";
  //   // let url = "http://ai.syntheta.net/api/analyze/html";

  //   // #table:'Categories' and #Chart:'Centre ' can u give me overiew of the data

  //   let url = "http://localhost:8005/api/analyze/html";

    
  //   return this.httpClient.post(url, obj)
  //  }


    //https://api.syntheta.net/get-raw-data-dump-by-id/1/1

    //////////////////////////////////////////////////////////////////////////


   postPromptToAi(obj : any):any{
    // let Oldurl = "http://localhost:5678/webhook/b721d281-5b60-49da-bc70-f62f6cece130/Chatbot";

    // let url = 'http://localhost:5678/webhook/dae43ef5-a798-4b60-b5bd-005c6b92573d'

    //correct one url
    // let url = 'https://automate.suryojasvi.com/webhook/1a0ec9d0-a5da-4ca5-8de2-b97c58fe8c5e'

    // baseurl with txt file name called 'Syntheta AI Chatbot' which is main
    let url = 'https://automate.suryojasvi.com/webhook/d0b0fe8e-a422-4d2f-9b7d-f3dfcad20d51/chatbot'


 // baseurl with txt file locally
    // let url = 'http://localhost:5678/webhook/94aa9dad-aff2-4a22-bf14-2d69034b04b4'

    // https://automate.suryojasvi.com/webhook/74c4ce6f-e3e0-4c9f-8c66-40f271975178
    return this.httpClient.post(url, obj)
   }


   createHTMLViewer(obj : any):any{
    // let url = "https://automate.suryojasvi.com/webhook/1e408f28-08aa-457d-b7b4-6a60b2f1c505";

    // main url
    // let url = "http://ai.syntheta.net/api/analyze/html";

    //local url
    // let url = "http://localhost:8005/api/analyze/html";

    //updated  url
    let url = "https://ai.syntheta.net/api/analyze/html";

   
    
    return this.httpClient.post(url, obj)
   }
   

   ////////////////////////////////// wizard chatbot api for cred 

   callWizardApi(payload: any, db_name: string = 'cred'): any { 
  /**
   * payload structure:
   * {
   *   thread_id: string,
   *   content: string,
   *   dashboard_context: {
   *     dashboard_id?: string,
   *     timezone?: string,
   *     time_range?: { from, to, granularity },
   *     filters?: object,
   *     kpis?: object,
   *     table_views?: array
   *   }
   * }
   */
  const url = `https://edu.wyzmindz.com/chat?db_name=${db_name}`;
  return this.httpClient.post(url, payload);
}



 wizardChatApiWithFiles(payload: any, db_name: string = 'cred'): any {
   /**
    * payload structure:
    * {
    *   thread_id: string,
    *   content: string,
    *   dashboard_context: {
    *     dashboard_id?: string,
    *     timezone?: string,
    *     time_range?: { from, to, granularity },
    *     filters?: object,
    *     kpis?: object,
    *     table_views?: array
    *   }
    * }
    */
   const url = `https://edu.wyzmindz.com/chat/v1?db_name=${db_name}`;
   return this.httpClient.post(url, payload)
 }




 //////////////// post api for creating comments /////////////

 createComments(obj : any){
  let url = `${this.base_url}/comments`
  return this.httpClient.post(url, obj)

 }


  //  postPromptToAi(obj: any) {
  //   const url = "http://localhost:5678/webhook-test/xyz123/chatbot";
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  //   return this.httpClient.post(url, obj, { headers });
  // }


//   https://lenovo-api.syntheta.net and https://lenovo.syntheta.net
// https://keus.syntheta.net and https://keus-api.syntheta.net


  //apd_base url of instance of lenovo
  // lenovo_url = `https://lenovo.syntheta.net`
 // base_url  =  "https://lenovo-api.syntheta.net";
//https://lenovo-api.syntheta.net/docs

    //apd_base url of instance of keus
  // angular link = `https://keus.syntheta.net`
 // base_url  =  "https://keus-api.syntheta.net";

  //apd_base url of instance of apd
  // apd_url = `https://apd-api.syntheta.net`
  // base_url  =  "https://apd-api.syntheta.net";


// base_url = 'https://kalyan-api.syntheta.net';

//////demo url with port NO 8082
// base_url  =  "http://164.52.217.212";
  // base_url =  "https://api.syntheta.net:8082"

// Dwani api urls
// https://dwani-api.syntheta.net/
// base_url  =  "https://dwani-api.syntheta.net";

// https://dwani-api.syntheta.net/docs
// https://dwani.syntheta.net/docs


  //////////// base_url = "https://tst-lenovo.syntheta.net:9001"
// new lenovo url 


}