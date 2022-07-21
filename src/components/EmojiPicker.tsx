import { FC } from 'react';
import Picker, { IEmojiPickerProps } from 'emoji-picker-react';
import {
  Button,
  Icon,
  IconButton,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';
import { BsEmojiSmile } from 'react-icons/bs';

const EmojiPickerPopover: FC<IEmojiPickerProps> = (props) => (
  <Popover>
    <PopoverTrigger>
      <IconButton
        aria-label="Input Emoji"
        isRound
        variant="outline"
        _hover={{ opacity: '0.6', color: 'white' }}
        icon={<Icon as={BsEmojiSmile} />}
      />
    </PopoverTrigger>
    <PopoverContent maxWidth={0} borderStyle="none">
      <PopoverCloseButton />
      <Picker {...props} />
    </PopoverContent>
  </Popover>
);

export default EmojiPickerPopover;
