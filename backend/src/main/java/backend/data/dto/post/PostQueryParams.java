package backend.data.dto.post;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostQueryParams {
    String type;
    String hashTag;
    String userId;
    Boolean isDeleted = false;
}
