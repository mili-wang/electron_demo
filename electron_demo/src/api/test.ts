import request from "@/utils/reuqest";

export function getUsers(params: any = {}): any {
  return request({
    url: `/users`,
    method: "get",
    params,
  });
}