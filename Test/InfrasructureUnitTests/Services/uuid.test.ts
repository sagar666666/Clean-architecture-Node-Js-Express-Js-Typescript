import { UUIDService } from '../../../src/Infrastructure/UUID/uuidService';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid', () => ({
    v4: jest.fn(),
}));

describe('UUIDService', () => {
    let uuidService: UUIDService;
    let mockUuid: jest.Mock;

    beforeEach(() => {
        uuidService = new UUIDService();
        mockUuid = uuidv4 as jest.Mock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getNewId', () => {
        it('should return a new UUID', () => {
            const mockUUID = '123e4567-e89b-12d3-a456-426614174000';
            mockUuid.mockReturnValueOnce(mockUUID);
            const result = uuidService.getNewId();
            expect(result).toBe(mockUUID);
            expect(mockUuid).toHaveBeenCalledTimes(1);
        });

        it('should return a different UUID each time', () => {
            const mockUUID1 = '123e4567-e89b-12d3-a456-426614174001';
            const mockUUID2 = '123e4567-e89b-12d3-a456-426614174002';
            mockUuid.mockReturnValueOnce(mockUUID1).mockReturnValueOnce(mockUUID2);
            const result1 = uuidService.getNewId();
            const result2 = uuidService.getNewId();
            expect(result1).toBe(mockUUID1);
            expect(result2).toBe(mockUUID2);
            expect(mockUuid).toHaveBeenCalledTimes(2);
        });
    });
});
