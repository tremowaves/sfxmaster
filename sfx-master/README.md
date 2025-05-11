# SFX MASTER

A modern UI framework for building beautiful and responsive web applications.

## Features

- Modern and responsive design
- Easy to use components
- Cross-platform compatibility
- High performance

## Tính năng chính

- **Phát và Dừng**: Điều khiển phát/dừng âm thanh
- **Điều chỉnh Volume**: Thay đổi âm lượng từ -40dB đến 0dB
- **Lặp vô hạn**: Tùy chọn lặp lại âm thanh
- **Variation**: Điều chỉnh pitch từ -3 đến +3
- **Export**: Xuất file âm thanh đã xử lý
- **Phân loại**: Hệ thống phân loại âm thanh thông minh

## Công nghệ sử dụng

- React 19
- Tone.js cho xử lý âm thanh
- Tailwind CSS cho giao diện
- Radix UI cho các components

## Cài đặt

1. Clone repository:
```bash
git clone [URL-repository]
cd sfx-maker
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Chạy ứng dụng:
```bash
npm start
```

Ứng dụng sẽ chạy tại [http://localhost:3000](http://localhost:3000)

## Cấu trúc dự án

```
sfx-maker/
├── src/           # Mã nguồn React
├── public/        # File tĩnh
├── scripts/       # Scripts tiện ích
└── package.json   # Cấu hình project
```

## Sử dụng

1. **Thêm file âm thanh**: Kéo thả hoặc chọn file từ máy tính
2. **Điều chỉnh âm thanh**:
   - Volume: Sử dụng thanh trượt
   - Lặp: Nhấn nút Repeat
   - Variation: Chọn giá trị từ -3 đến +3
3. **Export**: Nhấn nút Export để lưu file đã xử lý

## Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng tạo issue hoặc pull request.

## Giấy phép

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## Audio Types

- SfxFootstep: Footstep sound effects
- SfxWeapon: Weapon sound effects
- SfxEnvironment: Environmental sounds
- UIMain: Main UI sounds
- Bgm: Background music
- Sfx Character: Character-related sound effects

## Technologies Used

- React.js
- Tone.js for audio processing
- Tailwind CSS for styling
- Lucide React for icons

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Project Structure

```
sfx-maker/
├── src/
│   ├── components/
│   │   └── SfxMaker.js
│   ├── App.js
│   └── index.js
├── public/
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Tone.js for audio processing capabilities
- React team for the amazing framework
- Tailwind CSS for the styling utilities
