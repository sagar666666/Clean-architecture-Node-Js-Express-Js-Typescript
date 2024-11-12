export const mockResponse = () => {
    const res: any = {};  // 'any' type to avoid TypeScript errors
  
    // Mocking the `status` method
    res.status = jest.fn().mockReturnValue(res);  // Makes it chainable (res.status().json())
    
    // Mocking the `json` method
    res.json = jest.fn().mockReturnValue(res);    // Makes it chainable as well
  
    return res;
  };